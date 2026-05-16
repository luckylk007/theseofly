import type { CMSPage, PostType } from "../types/cms";
import type {
  TemplateConditionField,
  TemplateConditionRule,
  TemplateConditions,
  ThemeTemplate,
} from "../types/theme-builder";

export interface TemplateRenderContext {
  pageId?: string | null;
  slug?: string | null;
  pageType: string;
  postType?: PostType | string | null;
  countryIds?: string[];
  countrySlugs?: string[];
  cityIds?: string[];
  citySlugs?: string[];
  serviceIds?: string[];
  serviceSlugs?: string[];
  categoryIds?: string[];
  categorySlugs?: string[];
  tagIds?: string[];
  tagSlugs?: string[];
}

const FIELD_WEIGHTS: Record<TemplateConditionField, number> = {
  specific_page: 100,
  url_slug: 80,
  url_pattern: 75,
  service: 65,
  tag: 60,
  city: 55,
  category: 50,
  country: 45,
  post_type: 40,
  page_type: 20,
};

export function createEmptyTemplateConditions(): TemplateConditions {
  return {
    match: "all",
    rules: [],
  };
}

export function normalizeTemplateConditions(input: unknown): TemplateConditions {
  if (!input || typeof input !== "object") {
    return createEmptyTemplateConditions();
  }

  const candidate = input as Partial<TemplateConditions>;
  return {
    match: candidate.match === "any" ? "any" : "all",
    rules: Array.isArray(candidate.rules)
      ? candidate.rules.map(normalizeRule).filter(Boolean) as TemplateConditionRule[]
      : [],
  };
}

function normalizeRule(rule: unknown): TemplateConditionRule | null {
  if (!rule || typeof rule !== "object") {
    return null;
  }

  const candidate = rule as Partial<TemplateConditionRule>;
  if (!candidate.id || !candidate.field) {
    return null;
  }

  return {
    id: candidate.id,
    type: candidate.type === "exclude" ? "exclude" : "include",
    field: candidate.field,
    values: Array.isArray(candidate.values)
      ? candidate.values.map((value) => String(value)).filter(Boolean)
      : [],
  };
}

export function describeTemplateConditions(
  conditions: TemplateConditions,
  labelMap?: Partial<Record<TemplateConditionField, Record<string, string>>>
) {
  const normalized = normalizeTemplateConditions(conditions);

  if (normalized.rules.length === 0) {
    return "This template applies globally.";
  }

  const joiner = normalized.match === "all" ? "and" : "or";
  const segments = normalized.rules.map((rule) => describeRule(rule, labelMap));

  return `This template applies when ${segments.join(` ${joiner} `)}.`;
}

function describeRule(
  rule: TemplateConditionRule,
  labelMap?: Partial<Record<TemplateConditionField, Record<string, string>>>
) {
  const labels = labelMap?.[rule.field] || {};
  const renderedValues =
    rule.values.length > 0
      ? rule.values.map((value) => labels[value] || value).join(", ")
      : "all items";

  const prefix = rule.type === "exclude" ? "not" : "";

  switch (rule.field) {
    case "page_type":
      return `${prefix} page type is ${renderedValues}`.trim();
    case "category":
      return `${prefix} in categories ${renderedValues}`.trim();
    case "tag":
      return `${prefix} tagged with ${renderedValues}`.trim();
    case "country":
      return `${prefix} country is ${renderedValues}`.trim();
    case "city":
      return `${prefix} city is ${renderedValues}`.trim();
    case "service":
      return `${prefix} service is ${renderedValues}`.trim();
    case "post_type":
      return `${prefix} post type is ${renderedValues}`.trim();
    case "specific_page":
      return `${prefix} on specific pages ${renderedValues}`.trim();
    case "url_slug":
      return `${prefix} URL slug matches ${renderedValues}`.trim();
    case "url_pattern":
      return `${prefix} URL pattern matches ${renderedValues}`.trim();
    default:
      return renderedValues;
  }
}

export function buildTemplateLabelMaps(pageCatalog: CMSPage[]) {
  const pageLabels: Record<string, string> = {};
  const slugLabels: Record<string, string> = {};
  const categoryLabels: Record<string, string> = {};
  const tagLabels: Record<string, string> = {};
  const countryLabels: Record<string, string> = {};
  const cityLabels: Record<string, string> = {};
  const serviceLabels: Record<string, string> = {};

  for (const page of pageCatalog) {
    pageLabels[page.id] = page.title;
    slugLabels[page.slug] = `/${page.slug}`;

    for (const category of page.categories) {
      categoryLabels[category.id] = category.name;
      categoryLabels[category.slug] = category.name;
    }

    for (const tag of page.tag_entities) {
      tagLabels[tag.id] = tag.name;
      tagLabels[tag.slug] = tag.name;
    }
  }

  return {
    page_type: {
      single_page: "Single Page",
      single_post: "Single Post",
    },
    post_type: {
      page: "Page",
      post: "Post",
      blog: "Blog",
      news: "News",
      newsletter: "Newsletter",
      "case-study": "Case Study",
    },
    specific_page: pageLabels,
    url_slug: slugLabels,
    category: categoryLabels,
    tag: tagLabels,
    country: countryLabels,
    city: cityLabels,
    service: serviceLabels,
  } satisfies Partial<Record<TemplateConditionField, Record<string, string>>>;
}

export function resolveTemplateForPage(
  templates: ThemeTemplate[],
  context: TemplateRenderContext
) {
  const candidates = templates
    .filter((template) => template.is_active && template.status !== "draft")
    .filter((template) => isTemplateTypeCompatible(template.type, context.pageType))
    .map((template) => ({
      template,
      result: evaluateTemplate(template, context),
    }))
    .filter((entry) => entry.result.matches);

  if (candidates.length === 0) {
    return null;
  }

  candidates.sort((a, b) => {
    if (b.result.score !== a.result.score) {
      return b.result.score - a.result.score;
    }

    if (b.template.priority !== a.template.priority) {
      return b.template.priority - a.template.priority;
    }

    return new Date(b.template.updated_at).getTime() - new Date(a.template.updated_at).getTime();
  });

  return candidates[0].template;
}

function isTemplateTypeCompatible(templateType: ThemeTemplate["type"], pageType: string) {
  if (pageType === "single_post") {
    return templateType === "single_post";
  }

  if (pageType === "single_page") {
    return templateType === "single_page";
  }

  return true;
}

function evaluateTemplate(template: ThemeTemplate, context: TemplateRenderContext) {
  const conditions = normalizeTemplateConditions(template.conditions);

  if (conditions.rules.length === 0) {
    return { matches: true, score: template.priority };
  }

  const includeRules = conditions.rules.filter((rule) => rule.type === "include");
  const excludeRules = conditions.rules.filter((rule) => rule.type === "exclude");

  if (excludeRules.some((rule) => ruleMatches(rule, context))) {
    return { matches: false, score: 0 };
  }

  const includeMatches = includeRules.map((rule) => ({
    rule,
    matches: ruleMatches(rule, context),
  }));

  const includeSatisfied =
    includeRules.length === 0
      ? true
      : conditions.match === "all"
        ? includeMatches.every((entry) => entry.matches)
        : includeMatches.some((entry) => entry.matches);

  if (!includeSatisfied) {
    return { matches: false, score: 0 };
  }

  const score =
    template.priority +
    includeMatches
      .filter((entry) => entry.matches)
      .reduce((sum, entry) => sum + FIELD_WEIGHTS[entry.rule.field], 0);

  return { matches: true, score };
}

function ruleMatches(rule: TemplateConditionRule, context: TemplateRenderContext) {
  const values = new Set(rule.values);

  switch (rule.field) {
    case "page_type":
      return values.has(context.pageType);
    case "post_type":
      return context.postType ? values.has(context.postType) : false;
    case "specific_page":
      return context.pageId ? values.has(context.pageId) : false;
    case "url_slug":
      return context.slug ? values.has(context.slug) : false;
    case "category":
      return hasAnyMatch(values, context.categoryIds, context.categorySlugs);
    case "tag":
      return hasAnyMatch(values, context.tagIds, context.tagSlugs);
    case "country":
      return hasAnyMatch(values, context.countryIds, context.countrySlugs);
    case "city":
      return hasAnyMatch(values, context.cityIds, context.citySlugs);
    case "service":
      return hasAnyMatch(values, context.serviceIds, context.serviceSlugs);
    case "url_pattern":
      return context.slug ? [...values].some((value) => matchPattern(context.slug!, value)) : false;
    default:
      return false;
  }
}

function hasAnyMatch(values: Set<string>, ids?: string[], slugs?: string[]) {
  return [...(ids || []), ...(slugs || [])].some((value) => values.has(value));
}

function matchPattern(slug: string, pattern: string) {
  if (!pattern) {
    return false;
  }

  const normalized = pattern.replace(/^\//, "");
  const escaped = normalized.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
  return new RegExp(`^${escaped}$`).test(slug);
}
