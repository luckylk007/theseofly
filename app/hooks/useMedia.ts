import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../stores/useAuthStore";

export function useMedia() {
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  const fetchMedia = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setMedia(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMedia();
  }, [user]);

  const uploadFile = async (file: File, websiteId: string) => {
    if (!user) return;

    // 1. Upload to Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    const { error: uploadError, data: uploadData } = await supabase.storage
      .from('media')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // 2. Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(filePath);

    // 3. Save to Media Table
    const { data, error: dbError } = await supabase
      .from('media')
      .insert([{
        website_id: websiteId,
        file_name: file.name,
        file_path: publicUrl,
        file_type: file.type,
        file_size: file.size,
      }])
      .select()
      .single();

    if (dbError) throw dbError;
    
    setMedia([data, ...media]);
    return data;
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
