import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../stores/useAuthStore";

export function useMedia() {
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  const fetchMedia = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setMedia(data || []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [user]);

  const uploadFile = async (file: File, websiteId: string) => {
    if (!user) {
      throw new Error("You must be logged in to upload files.");
    }

    try {
      // 1. Upload to Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      console.log(`Uploading ${file.name} to ${filePath}...`);

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        throw uploadError;
      }

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      console.log(`File uploaded successfully. Public URL: ${publicUrl}`);

      // 3. Save to Media Table
      const { data, error: dbError } = await supabase
        .from('media')
        .insert([{
          website_id: websiteId,
          file_name: file.name,
          file_path: publicUrl,
          file_type: file.type,
          file_size: file.size,
          metadata: { storage_path: filePath }
        }])
        .select()
        .single();

      if (dbError) {
        console.error("Database insert error:", dbError);
        throw dbError;
      }
      
      setMedia(prev => [data, ...prev]);
      return data;
    } catch (err: any) {
      console.error("Full upload process error:", err);
      throw err;
    }
  };

  const deleteFile = async (id: string, storagePath: string) => {
    // 1. Delete from Storage (extract path from URL if needed)
    // Note: Assuming storagePath is the relative path in the bucket
    const { error: storageError } = await supabase.storage
      .from('media')
      .remove([storagePath]);

    if (storageError) console.warn('Storage delete error:', storageError.message);

    // 2. Delete from DB
    const { error: dbError } = await supabase
      .from('media')
      .delete()
      .eq('id', id);

    if (dbError) throw dbError;
    
    setMedia(media.filter(m => m.id !== id));
  };

  return { media, loading, error, fetchMedia, uploadFile, deleteFile };
}
