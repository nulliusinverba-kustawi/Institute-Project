export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  cover_path: string | null
  image_fit: 'cover' | 'contain'
  published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  title: string
  slug: string
  description: string
  embed_html: string | null   // Raw embed snippet (e.g. Klaviyo signup form div) rendered as-is below the description
  embed_transparent_bg: boolean   // Strips the embed's own white panel background so it blends into the page
  klaviyo_list_id: string | null   // Klaviyo list this event's registration form feeds into — used by the fallback form when embed_html fails to load
  cover_path: string | null
  doc_path: string | null   // Optional PDF/DOC/DOCX download; null = no download shown
  location: string | null
  event_date: string
  external_url: string | null   // Optional link to external registration (e.g. Eventbrite)
  organizer: string | null
  event_type: 'kustawi' | 'other'
  image_fit: 'cover' | 'contain'
  image_border: boolean   // Whether the contain-mode letterbox background shows around the cover image
  layout_order: string[]   // Admin-defined block order — see src/lib/event-layout.ts
  published: boolean
  created_at: string
  updated_at: string
}

export interface ReadingListItem {
  id: string
  title: string
  author: string | null
  description: string | null
  cover_path: string | null
  image_fit: 'cover' | 'contain'
  external_url: string | null
  email: string | null
  author_region: 'canadian' | 'world' | null
  item_type: 'book' | 'thesis_ma' | 'thesis_phd' | null
  video_url: string | null
  published: boolean
  created_at: string
  updated_at: string
}

export interface Partner {
  id: string
  name: string
  logo_path: string | null
  image_fit: 'cover' | 'contain'
  description: string | null
  website_url: string | null
  sort_order: number
  published: boolean
  created_at: string
}

export interface SiteSetting {
  key: string
  value: string
}

export interface SiteSettings {
  site_name: string
  site_description: string
  logo_path: string
  contact_email: string
  contact_phone: string
  address: string
  // Administrator info — shown in footer
  admin_name: string
  admin_title: string
  admin_email: string
  admin_email_2: string
  // Footer field visibility — stored as 'true' | 'false' strings
  admin_name_visible: string
  admin_title_visible: string
  admin_email_visible: string
  admin_email_2_visible: string
  contact_phone_visible: string
  address_visible: string
  // Page visibility — stored as 'true' | 'false' strings
  about_enabled: string
  mission_enabled: string
  blogs_enabled: string
  events_enabled: string
  reading_list_enabled: string
  partners_enabled: string
  newsletter_enabled: string
  // Logo visibility
  logo_visible: string
  // Home hero images
  home_hero_image_path: string
  home_hero_bg_path: string
  // Section visibility
  health_wellness_enabled: string
  research_enabled: string
  values_page_enabled: string
  research_institutes_enabled: string
  call_for_papers_enabled: string
  sexual_abuse_boys_men_enabled: string
  advocates_enabled: string
  psychotherapists_enabled: string
  referral_agencies_enabled: string
  black_mens_groups_enabled: string
  youth_service_organizations_enabled: string
  community_organizations_enabled: string
  // Home section visibility
  intro_section_enabled:   string
  cta_section_enabled:     string
  goal_section_enabled:    string
  impact_section_enabled:  string
  mission_section_enabled: string
  // H&W featured section
  wellness_section_enabled: string
  wellness_section_blurb:   string
  wellness_featured_mode:   string  // 'latest' | 'manual'
  wellness_featured_ids:    string  // JSON array of up to 3 post IDs
  // Nav config
  nav_config: string  // JSON array of NavItem
  // Reading list feature
  book_of_the_month_id: string  // empty string = not set
  // Event section blurbs
  kustawi_blurb: string
  non_affiliated_blurb: string
  // Social media links
  social_facebook: string
  social_instagram: string
  social_twitter: string
  social_linkedin: string
  social_youtube: string
  // Footer
  footer_copyright_suffix: string
  footer_nav_heading: string
  footer_contact_heading: string
  // Upcoming events section
  upcoming_events_section_enabled: string
  upcoming_events_max_count: string
  upcoming_events_heading: string
  // Newsletter signup section
  signup_section_enabled: string
  newsletter_heading: string
  newsletter_subtext: string
  newsletter_success_message: string
  newsletter_consent_text: string
  // Site access gate
  site_gate_enabled: string
  site_gate_password: string
  // Klaviyo onsite popup
  klaviyo_popup_enabled: string
  klaviyo_company_id: string
}

export interface GoalPillar {
  num: string
  label: string
  desc: string
}
export interface GoalSectionContent {
  label: string
  title: string
  description: string
  pillars: GoalPillar[]
  cta_label?: string
  cta_href?: string
}

export interface ImpactSectionContent {
  label: string
  title: string
  description: string
  items: string[]
}

export interface MissionPillar {
  icon_name: 'Heart' | 'BookOpen' | 'Shield' | 'Users'
  title: string
  desc: string
}
export interface MissionSectionContent {
  label: string
  title: string
  description: string
  pillars: MissionPillar[]
}

export interface PageContent {
  id: string
  page: string
  section: string
  content: string
  updated_at: string
}

export interface ActionResult<T = undefined> {
  success: boolean
  data?: T
  error?: string
}

export type SubmissionType   = 'research_call' | 'research_note' | 'commentary'
export type SubmissionStatus = 'pending' | 'approved' | 'rejected'

export interface NewsletterEdition {
  id: string
  title: string
  slug: string
  intro: string
  cover_path: string | null
  published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface NewsletterSubmission {
  id: string
  type: SubmissionType
  status: SubmissionStatus
  title: string
  content: string
  abstract: string | null
  submitter_name: string
  submitter_email: string
  submitter_role: string | null
  institution: string | null
  admin_note: string | null
  reviewed_at: string | null
  edition_id: string | null
  deadline: string | null
  contact_email: string | null
  created_at: string
  updated_at: string
}

export const WELLNESS_TAGS = [
  'Fitness',
  'Nutrition',
  'Mental Health',
  'Mindfulness',
  'Sleep',
  'Recovery',
  'General Wellness',
] as const

export type WellnessTag = typeof WELLNESS_TAGS[number]

export interface WellnessPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  cover_path: string | null
  doc_path: string | null     // PDF/DOC/DOCX download — null = no download shown
  tags: string[]
  published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

export type ResearchCategory =
  | 'announcements'           // displayed as "Call for Participants" — label-only rename
  | 'call-for-papers'
  | 'recent-publications'
  | 'reports'
  | 'research-institutes'
  | 'sexual-abuse-boys-men'
  | 'mmbm'                    // sub-category of the "Current Issues" nav group
  | 'racial-profiling'        // sub-category of the "Current Issues" nav group
  | 'disabilities'
  | 'sexualities'

export const RESEARCH_CATEGORIES: ResearchCategory[] = [
  'announcements',
  'call-for-papers',
  'recent-publications',
  'reports',
  'research-institutes',
  'sexual-abuse-boys-men',
  'mmbm',
  'racial-profiling',
  'disabilities',
  'sexualities',
]

// mmbm/racial-profiling are not top-level nav links — they're grouped under a
// "Current Issues" flyout in Header.tsx (see CURRENT_ISSUES_CATEGORIES there).
export const RESEARCH_CATEGORY_LABELS: Record<ResearchCategory, string> = {
  'announcements':         'Call for Participants',
  'call-for-papers':       'Call for Papers',
  'recent-publications':   'Recent Publications',
  'reports':               'Reports',
  'research-institutes':   'Research Institutes and Initiatives',
  'sexual-abuse-boys-men': 'Sexual Abuse of Boys and Men',
  'mmbm':                  'MMBM',
  'racial-profiling':      'Racial Profiling',
  'disabilities':          'Disabilities',
  'sexualities':           'Sexualities',
}

export type ResearchItemType = 'article' | 'book' | 'video' | 'dissertation'

export const ITEM_TYPE_LABELS: Record<ResearchItemType, string> = {
  article:      'Article',
  book:         'Book',
  video:        'Video',
  dissertation: 'Dissertation',
}

export interface ResearchPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  cover_path: string | null
  image_fit: 'cover' | 'contain'
  doc_path: string | null   // Optional PDF/DOC/DOCX download; null = no download shown
  category: ResearchCategory
  external_url: string | null
  region: 'canadian' | 'world' | null
  author: string | null
  item_type: ResearchItemType | null
  email: string | null
  published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

export type DirectoryCategory =
  | 'advocate'
  | 'psychotherapist'
  | 'referral_agency'
  | 'black_mens_group'
  | 'youth_service_organization'
  | 'community_organization'
export type DirectoryMode     = 'online' | 'in-person' | 'both'

export const DIRECTORY_CATEGORIES: DirectoryCategory[] = [
  'advocate', 'psychotherapist', 'referral_agency', 'black_mens_group',
  'youth_service_organization', 'community_organization',
]

export const DIRECTORY_CATEGORY_LABELS: Record<DirectoryCategory, string> = {
  advocate:                    'Advocates',
  psychotherapist:             'Psychotherapists',
  referral_agency:             'Referral Agencies',
  black_mens_group:            "Black Men's Groups",
  youth_service_organization:  'Youth Service Organizations',
  community_organization:      'Community and Professional Organizations',
}

// Categories where the admin-facing "Name" field is hidden — Organization is
// the title field instead. `name` is still auto-synced to `organization` on
// save so every downstream consumer (cards, search, avatar initials) keeps
// working without extra logic.
export const DIRECTORY_HIDE_NAME: DirectoryCategory[] = [
  'advocate', 'youth_service_organization', 'community_organization', 'referral_agency',
]

// Categories where a Province field is collected
export const DIRECTORY_SHOW_PROVINCE: DirectoryCategory[] = [
  'community_organization', 'advocate', 'black_mens_group', 'referral_agency', 'youth_service_organization',
]

export const DIRECTORY_ORG_PLACEHOLDER: Record<DirectoryCategory, string> = {
  advocate:                    'e.g. Advocacy Organization',
  psychotherapist:             'e.g. Psychotherapy Practice',
  referral_agency:             'e.g. Referral Agency',
  black_mens_group:            "e.g. Black Men's Group",
  youth_service_organization:  'e.g. Youth Service Organization',
  community_organization:      'e.g. Community or Professional Organization',
}

export const DIRECTORY_MODE_LABELS: Record<DirectoryMode, string> = {
  online:     'Online',
  'in-person': 'In-Person',
  both:       'Online & In-Person',
}

// Canadian provinces/territories — collected for categories in DIRECTORY_SHOW_PROVINCE
export const CANADIAN_PROVINCES = [
  'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
  'Newfoundland and Labrador', 'Northwest Territories', 'Nova Scotia',
  'Nunavut', 'Ontario', 'Prince Edward Island', 'Quebec',
  'Saskatchewan', 'Yukon',
] as const

// Bookstores — third section on the public Reading List page, alongside
// Bibliography and MA/PhD Theses. Physical/online bookstore locations, not
// individual reading-list items.
export interface Bookstore {
  id: string
  name: string
  description: string | null
  email: string | null
  province: string | null
  address: string | null
  phone_number: string | null
  website_url: string | null
  photo_path: string | null
  published: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

// Values page — seven pillars of COURAGE, offered in multiple languages.
// Fixed in code (same precedent as DIRECTORY_CATEGORIES) — pillar text itself
// is admin-editable via page_content sections `pillars_{code}`.
export interface ValuesLanguage {
  code: string
  label: string
}

export const VALUES_LANGUAGES: ValuesLanguage[] = [
  { code: 'en', label: 'English' },
  { code: 'am', label: 'Amharic' },
  { code: 'ar', label: 'Arabic' },
  { code: 'er', label: 'Eritrean' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'sw', label: 'Kiswahili' },
  { code: 'so', label: 'Somali' },
  { code: 'ti', label: 'Tigrayan' },
]

export interface DirectoryEntry {
  id: string
  name: string
  organization: string | null
  description: string | null
  website_url: string | null
  email: string | null
  photo_path: string | null
  image_fit: 'cover' | 'contain'
  category: DirectoryCategory
  mode: DirectoryMode | null
  province: string | null
  published: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export type SearchResultType = 'blog' | 'event' | 'reading_list' | 'wellness' | 'research' | 'directory'

export interface SearchResult {
  id: string
  type: SearchResultType
  title: string
  slug: string
  excerpt: string | null
  published_at?: string | null
  event_date?: string | null
  cover_url?: string | null
}
