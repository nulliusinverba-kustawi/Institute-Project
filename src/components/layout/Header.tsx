'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, Search, ChevronDown, ChevronUp, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeToggle } from './ThemeToggle'
import { SearchBar } from './SearchBar'
import { cn } from '@/lib/utils'
import type { NavItem } from '@/lib/nav-config'
import { RESEARCH_CATEGORIES, RESEARCH_CATEGORY_LABELS } from '@/types'
import type { ResearchCategory } from '@/types'

interface HeaderProps {
  navItems: NavItem[]
  logoUrl?: string
  siteName?: string
  showReferralAgencies?: boolean
  showBlackMensGroups?: boolean
  showYouthServiceOrganizations?: boolean
  showCommunityOrganizations?: boolean
  showResearchInstitutes?: boolean
  showCallForPapers?: boolean
  showSexualAbuseBoysMen?: boolean
}

function renderSiteName(name: string) {
  const idx = name.indexOf('Institute')
  if (idx === -1) return <>{name}</>
  return (
    <>
      {name.slice(0, idx)}
      <span className="text-[hsl(35_60%_50%)]">Institute</span>
      {name.slice(idx + 'Institute'.length)}
    </>
  )
}

export function Header({ navItems, logoUrl, siteName = 'Institute', showReferralAgencies = true, showBlackMensGroups = true, showYouthServiceOrganizations = true, showCommunityOrganizations = true, showResearchInstitutes = true, showCallForPapers = true, showSexualAbuseBoysMen = true }: HeaderProps) {
  const researchGates: Partial<Record<ResearchCategory, boolean>> = {
    'research-institutes':   showResearchInstitutes,
    'call-for-papers':       showCallForPapers,
    'sexual-abuse-boys-men': showSexualAbuseBoysMen,
  }
  const visibleResearchCategories = RESEARCH_CATEGORIES.filter((cat) => researchGates[cat] !== false)
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [eventsDropdownOpen, setEventsDropdownOpen] = useState(false)
  const [eventsAccordionOpen, setEventsAccordionOpen] = useState(false)
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false)
  const [servicesAccordionOpen, setServicesAccordionOpen] = useState(false)
  const [researchDropdownOpen, setResearchDropdownOpen] = useState(false)
  const [researchAccordionOpen, setResearchAccordionOpen] = useState(false)
  const [currentIssuesFlyoutOpen, setCurrentIssuesFlyoutOpen] = useState(false)
  const [currentIssuesAccordionOpen, setCurrentIssuesAccordionOpen] = useState(false)
  const [readingListDropdownOpen, setReadingListDropdownOpen] = useState(false)
  const [readingListAccordionOpen, setReadingListAccordionOpen] = useState(false)
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false)
  const [aboutAccordionOpen, setAboutAccordionOpen] = useState(false)

  const visibleLinks = navItems.filter((i) => i.visible)

  return (
    <header className="sticky top-0 z-50 bg-background dark:bg-dark-background border-b border-border dark:border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            {logoUrl && (
              <Image src={logoUrl} alt={siteName} width={32} height={32} className="h-8 w-auto" />
            )}
            <span className="font-serif text-xl font-bold tracking-tight text-text-primary dark:text-white">
              {renderSiteName(siteName)}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {visibleLinks.map(({ href, label, slug }) => {
              const isActive = pathname === href || (href !== '/' && pathname.startsWith(href + '/'))
              const linkClass = cn(
                'text-sm font-medium transition-colors',
                isActive ? 'text-brand-teal dark:text-white' : 'text-text-muted hover:text-brand-teal dark:hover:text-white'
              )

              if (slug === 'services') {
                return (
                  <div
                    key={href}
                    className="relative"
                    onMouseEnter={() => setServicesDropdownOpen(true)}
                    onMouseLeave={() => setServicesDropdownOpen(false)}
                  >
                    <Link href="/access-to-services" className={cn(linkClass, 'flex items-center gap-1 cursor-pointer')}>
                      {label}
                      <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                    </Link>
                    <AnimatePresence>
                      {servicesDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.15, ease: 'easeOut' }}
                          className="absolute top-full left-0 mt-2 w-52 rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] shadow-lg overflow-hidden z-50"
                        >
                          <Link
                            href="/advocates"
                            className="block px-4 py-3 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] dark:hover:text-white hover:bg-[var(--color-surface)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors"
                            onClick={() => setServicesDropdownOpen(false)}
                          >
                            Advocates
                          </Link>
                          <Link
                            href="/psychotherapists"
                            className="block px-4 py-3 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] dark:hover:text-white hover:bg-[var(--color-surface)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)]"
                            onClick={() => setServicesDropdownOpen(false)}
                          >
                            Psychotherapists
                          </Link>
                          {showReferralAgencies && (
                            <Link
                              href="/referral-agencies"
                              className="block px-4 py-3 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] dark:hover:text-white hover:bg-[var(--color-surface)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)]"
                              onClick={() => setServicesDropdownOpen(false)}
                            >
                              Referral Agencies
                            </Link>
                          )}
                          {showBlackMensGroups && (
                            <Link
                              href="/black-mens-groups"
                              className="block px-4 py-3 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] dark:hover:text-white hover:bg-[var(--color-surface)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)]"
                              onClick={() => setServicesDropdownOpen(false)}
                            >
                              Black Men&#39;s Groups
                            </Link>
                          )}
                          {showYouthServiceOrganizations && (
                            <Link
                              href="/youth-service-organizations"
                              className="block px-4 py-3 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] dark:hover:text-white hover:bg-[var(--color-surface)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)]"
                              onClick={() => setServicesDropdownOpen(false)}
                            >
                              Youth Service Organizations
                            </Link>
                          )}
                          {showCommunityOrganizations && (
                            <Link
                              href="/community-organizations"
                              className="block px-4 py-3 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] dark:hover:text-white hover:bg-[var(--color-surface)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)]"
                              onClick={() => setServicesDropdownOpen(false)}
                            >
                              Community and Professional Organizations
                            </Link>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              }

              if (slug === 'events') {
                return (
                  <div
                    key={href}
                    className="relative"
                    onMouseEnter={() => setEventsDropdownOpen(true)}
                    onMouseLeave={() => setEventsDropdownOpen(false)}
                  >
                    <Link href="/events" className={cn(linkClass, 'flex items-center gap-1 cursor-pointer')}>
                      {label}
                      <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                    </Link>
                    <AnimatePresence>
                      {eventsDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.15, ease: 'easeOut' }}
                          className="absolute top-full left-0 mt-2 w-52 rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] shadow-lg overflow-hidden z-50"
                        >
                          <Link
                            href="/events/kustawi"
                            className="block px-4 py-3 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] dark:hover:text-white hover:bg-[var(--color-surface)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors"
                            onClick={() => setEventsDropdownOpen(false)}
                          >
                            Kustawi Events
                          </Link>
                          <Link
                            href="/events/other"
                            className="block px-4 py-3 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] dark:hover:text-white hover:bg-[var(--color-surface)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)]"
                            onClick={() => setEventsDropdownOpen(false)}
                          >
                            Other Events
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              }

              if (slug === 'research') {
                return (
                  <div
                    key={href}
                    className="relative"
                    onMouseEnter={() => setResearchDropdownOpen(true)}
                    onMouseLeave={() => setResearchDropdownOpen(false)}
                  >
                    <Link href="/research" className={cn(linkClass, 'flex items-center gap-1 cursor-pointer')}>
                      {label}
                      <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                    </Link>
                    <AnimatePresence>
                      {researchDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.15, ease: 'easeOut' }}
                          className="absolute top-full left-0 mt-2 w-56 rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] shadow-lg z-50"
                        >
                          {visibleResearchCategories.map((cat, i) => {
                            if (cat === 'racial-profiling') return null
                            if (cat === 'mmbm') {
                              const isFirst = i === 0
                              const isLast  = i === visibleResearchCategories.length - 1 // 'racial-profiling' is skipped, so 'mmbm' can be last
                              return (
                                <div
                                  key="current-issues"
                                  className="relative"
                                  onMouseEnter={() => setCurrentIssuesFlyoutOpen(true)}
                                  onMouseLeave={() => setCurrentIssuesFlyoutOpen(false)}
                                >
                                  <Link
                                    href="/research/current-issues"
                                    className={`flex items-center justify-between gap-2 px-4 py-3 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] dark:hover:text-white hover:bg-[var(--color-surface)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors ${isFirst ? 'rounded-t-xl' : 'border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)]'} ${isLast ? 'rounded-b-xl' : ''}`}
                                    onClick={() => { setResearchDropdownOpen(false); setCurrentIssuesFlyoutOpen(false) }}
                                  >
                                    Current Issues
                                    <ChevronRight className="h-3.5 w-3.5 opacity-60 shrink-0" />
                                  </Link>
                                  <AnimatePresence>
                                    {currentIssuesFlyoutOpen && (
                                      <motion.div
                                        initial={{ opacity: 0, x: -6 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -6 }}
                                        transition={{ duration: 0.15, ease: 'easeOut' }}
                                        className="absolute top-0 left-full ml-1 w-52 rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] shadow-lg overflow-hidden z-50"
                                      >
                                        <Link
                                          href="/research/mmbm"
                                          className="block px-4 py-3 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] dark:hover:text-white hover:bg-[var(--color-surface)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors"
                                          onClick={() => { setResearchDropdownOpen(false); setCurrentIssuesFlyoutOpen(false) }}
                                        >
                                          MMBM
                                        </Link>
                                        <Link
                                          href="/research/racial-profiling"
                                          className="block px-4 py-3 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] dark:hover:text-white hover:bg-[var(--color-surface)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)]"
                                          onClick={() => { setResearchDropdownOpen(false); setCurrentIssuesFlyoutOpen(false) }}
                                        >
                                          Racial Profiling
                                        </Link>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              )
                            }
                            const isFirst = i === 0
                            const isLast  = i === visibleResearchCategories.length - 1
                            return (
                              <Link
                                key={cat}
                                href={`/research/${cat}`}
                                className={`block px-4 py-3 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] dark:hover:text-white hover:bg-[var(--color-surface)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors ${isFirst ? 'rounded-t-xl' : 'border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)]'} ${isLast ? 'rounded-b-xl' : ''}`}
                                onClick={() => setResearchDropdownOpen(false)}
                              >
                                {RESEARCH_CATEGORY_LABELS[cat]}
                              </Link>
                            )
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              }

              if (slug === 'reading-list') {
                return (
                  <div
                    key={href}
                    className="relative"
                    onMouseEnter={() => setReadingListDropdownOpen(true)}
                    onMouseLeave={() => setReadingListDropdownOpen(false)}
                  >
                    <Link href="/reading-list" className={cn(linkClass, 'flex items-center gap-1 cursor-pointer')}>
                      {label}
                      <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                    </Link>
                    <AnimatePresence>
                      {readingListDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.15, ease: 'easeOut' }}
                          className="absolute top-full left-0 mt-2 w-56 rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] shadow-lg overflow-hidden z-50"
                        >
                          <Link
                            href="/reading-list/book-of-the-month"
                            className="block px-4 py-3 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] dark:hover:text-white hover:bg-[var(--color-surface)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors"
                            onClick={() => setReadingListDropdownOpen(false)}
                          >
                            Book of the Month
                          </Link>
                          <Link
                            href="/reading-list/bibliography"
                            className="block px-4 py-3 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] dark:hover:text-white hover:bg-[var(--color-surface)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)]"
                            onClick={() => setReadingListDropdownOpen(false)}
                          >
                            Bibliography
                          </Link>
                          <Link
                            href="/reading-list/theses"
                            className="block px-4 py-3 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] dark:hover:text-white hover:bg-[var(--color-surface)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)]"
                            onClick={() => setReadingListDropdownOpen(false)}
                          >
                            MA and PhD Theses
                          </Link>
                          <Link
                            href="/reading-list/bookstores"
                            className="block px-4 py-3 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] dark:hover:text-white hover:bg-[var(--color-surface)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)]"
                            onClick={() => setReadingListDropdownOpen(false)}
                          >
                            Bookstores
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              }

              if (slug === 'about') {
                return (
                  <div
                    key={href}
                    className="relative"
                    onMouseEnter={() => setAboutDropdownOpen(true)}
                    onMouseLeave={() => setAboutDropdownOpen(false)}
                  >
                    <button className={cn(linkClass, 'flex items-center gap-1 cursor-pointer')}>
                      {label}
                      <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                    </button>
                    <AnimatePresence>
                      {aboutDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.15, ease: 'easeOut' }}
                          className="absolute top-full left-0 mt-2 w-56 rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] shadow-lg overflow-hidden z-50"
                        >
                          <Link
                            href="/values"
                            className="block px-4 py-3 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] dark:hover:text-white hover:bg-[var(--color-surface)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors"
                            onClick={() => setAboutDropdownOpen(false)}
                          >
                            Mission &amp; Values
                          </Link>
                          <Link
                            href="/about"
                            className="block px-4 py-3 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] dark:hover:text-white hover:bg-[var(--color-surface)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)]"
                            onClick={() => setAboutDropdownOpen(false)}
                          >
                            Founder
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              }

              return (
                <Link key={href} href={href} className={linkClass}>
                  {label}
                </Link>
              )
            })}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Search toggle */}
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className="p-2 rounded-md text-text-muted hover:text-brand-teal dark:hover:text-white transition-colors cursor-pointer"
              aria-label="Toggle search"
            >
              <Search size={18} />
            </button>

            <ThemeToggle />

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden p-2 rounded-md text-text-muted hover:text-brand-teal dark:hover:text-white transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search bar (expandable) */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="pb-3"
            >
              <SearchBar onClose={() => setSearchOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="lg:hidden overflow-hidden pb-4 flex flex-col gap-1"
            >
              {visibleLinks.map(({ href, label, slug }) => {
                const isActive = pathname === href || (href !== '/' && pathname.startsWith(href + '/'))

                if (slug === 'services') {
                  return (
                    <div key={href}>
                      <button
                        onClick={() => setServicesAccordionOpen((v) => !v)}
                        className={cn(
                          'w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer',
                          isActive
                            ? 'bg-surface dark:bg-dark-surface text-brand-teal dark:text-white'
                            : 'text-text-muted hover:text-brand-teal dark:hover:text-white'
                        )}
                      >
                        {label}
                        {servicesAccordionOpen
                          ? <ChevronUp className="h-3.5 w-3.5 opacity-60" />
                          : <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                        }
                      </button>
                      <AnimatePresence>
                        {servicesAccordionOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.15, ease: 'easeOut' }}
                            className="overflow-hidden pl-4 flex flex-col gap-0.5 mt-0.5"
                          >
                            <Link href="/access-to-services" onClick={() => { setMobileOpen(false); setServicesAccordionOpen(false) }} className="px-3 py-2 rounded-md text-sm font-semibold text-brand-teal dark:text-white border-b border-border dark:border-dark-border mb-0.5 pb-2">
                              All Services
                            </Link>
                            <Link href="/advocates" onClick={() => { setMobileOpen(false); setServicesAccordionOpen(false) }} className="px-3 py-2 rounded-md text-sm text-text-muted hover:text-brand-teal dark:hover:text-white transition-colors">
                              Advocates
                            </Link>
                            <Link href="/psychotherapists" onClick={() => { setMobileOpen(false); setServicesAccordionOpen(false) }} className="px-3 py-2 rounded-md text-sm text-text-muted hover:text-brand-teal dark:hover:text-white transition-colors">
                              Psychotherapists
                            </Link>
                            {showReferralAgencies && (
                              <Link href="/referral-agencies" onClick={() => { setMobileOpen(false); setServicesAccordionOpen(false) }} className="px-3 py-2 rounded-md text-sm text-text-muted hover:text-brand-teal dark:hover:text-white transition-colors">
                                Referral Agencies
                              </Link>
                            )}
                            {showBlackMensGroups && (
                              <Link href="/black-mens-groups" onClick={() => { setMobileOpen(false); setServicesAccordionOpen(false) }} className="px-3 py-2 rounded-md text-sm text-text-muted hover:text-brand-teal dark:hover:text-white transition-colors">
                                Black Men&#39;s Groups
                              </Link>
                            )}
                            {showYouthServiceOrganizations && (
                              <Link href="/youth-service-organizations" onClick={() => { setMobileOpen(false); setServicesAccordionOpen(false) }} className="px-3 py-2 rounded-md text-sm text-text-muted hover:text-brand-teal dark:hover:text-white transition-colors">
                                Youth Service Organizations
                              </Link>
                            )}
                            {showCommunityOrganizations && (
                              <Link href="/community-organizations" onClick={() => { setMobileOpen(false); setServicesAccordionOpen(false) }} className="px-3 py-2 rounded-md text-sm text-text-muted hover:text-brand-teal dark:hover:text-white transition-colors">
                                Community and Professional Organizations
                              </Link>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                }

                if (slug === 'research') {
                  return (
                    <div key={href}>
                      <button
                        onClick={() => setResearchAccordionOpen((v) => !v)}
                        className={cn(
                          'w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer',
                          isActive
                            ? 'bg-surface dark:bg-dark-surface text-brand-teal dark:text-white'
                            : 'text-text-muted hover:text-brand-teal dark:hover:text-white'
                        )}
                      >
                        {label}
                        {researchAccordionOpen
                          ? <ChevronUp className="h-3.5 w-3.5 opacity-60" />
                          : <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                        }
                      </button>
                      <AnimatePresence>
                        {researchAccordionOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.15, ease: 'easeOut' }}
                            className="overflow-hidden pl-4 flex flex-col gap-0.5 mt-0.5"
                          >
                            <Link href="/research" onClick={() => { setMobileOpen(false); setResearchAccordionOpen(false) }} className="px-3 py-2 rounded-md text-sm font-semibold text-brand-teal dark:text-white border-b border-border dark:border-dark-border mb-0.5 pb-2">
                              All Research
                            </Link>
                            {visibleResearchCategories.map((cat) => {
                              if (cat === 'racial-profiling') return null
                              if (cat === 'mmbm') {
                                return (
                                  <div key="current-issues-mobile">
                                    <button
                                      onClick={() => setCurrentIssuesAccordionOpen((v) => !v)}
                                      className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm text-text-muted hover:text-brand-teal dark:hover:text-white transition-colors cursor-pointer"
                                    >
                                      Current Issues
                                      {currentIssuesAccordionOpen
                                        ? <ChevronUp className="h-3.5 w-3.5 opacity-60" />
                                        : <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                                      }
                                    </button>
                                    <AnimatePresence>
                                      {currentIssuesAccordionOpen && (
                                        <motion.div
                                          initial={{ opacity: 0, height: 0 }}
                                          animate={{ opacity: 1, height: 'auto' }}
                                          exit={{ opacity: 0, height: 0 }}
                                          transition={{ duration: 0.15, ease: 'easeOut' }}
                                          className="overflow-hidden pl-4 flex flex-col gap-0.5 mt-0.5"
                                        >
                                          <Link
                                            href="/research/current-issues"
                                            onClick={() => { setMobileOpen(false); setResearchAccordionOpen(false); setCurrentIssuesAccordionOpen(false) }}
                                            className="px-3 py-2 rounded-md text-sm font-semibold text-brand-teal dark:text-white border-b border-border dark:border-dark-border mb-0.5 pb-2"
                                          >
                                            All Current Issues
                                          </Link>
                                          <Link
                                            href="/research/mmbm"
                                            onClick={() => { setMobileOpen(false); setResearchAccordionOpen(false); setCurrentIssuesAccordionOpen(false) }}
                                            className="px-3 py-2 rounded-md text-sm text-text-muted hover:text-brand-teal dark:hover:text-white transition-colors"
                                          >
                                            MMBM
                                          </Link>
                                          <Link
                                            href="/research/racial-profiling"
                                            onClick={() => { setMobileOpen(false); setResearchAccordionOpen(false); setCurrentIssuesAccordionOpen(false) }}
                                            className="px-3 py-2 rounded-md text-sm text-text-muted hover:text-brand-teal dark:hover:text-white transition-colors"
                                          >
                                            Racial Profiling
                                          </Link>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                )
                              }
                              return (
                                <Link
                                  key={cat}
                                  href={`/research/${cat}`}
                                  onClick={() => { setMobileOpen(false); setResearchAccordionOpen(false) }}
                                  className="px-3 py-2 rounded-md text-sm text-text-muted hover:text-brand-teal dark:hover:text-white transition-colors"
                                >
                                  {RESEARCH_CATEGORY_LABELS[cat]}
                                </Link>
                              )
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                }

                if (slug === 'events') {
                  return (
                    <div key={href}>
                      <button
                        onClick={() => setEventsAccordionOpen((v) => !v)}
                        className={cn(
                          'w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer',
                          isActive
                            ? 'bg-surface dark:bg-dark-surface text-brand-teal dark:text-white'
                            : 'text-text-muted hover:text-brand-teal dark:hover:text-white'
                        )}
                      >
                        {label}
                        {eventsAccordionOpen
                          ? <ChevronUp className="h-3.5 w-3.5 opacity-60" />
                          : <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                        }
                      </button>
                      <AnimatePresence>
                        {eventsAccordionOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.15, ease: 'easeOut' }}
                            className="overflow-hidden pl-4 flex flex-col gap-0.5 mt-0.5"
                          >
                            <Link
                              href="/events"
                              onClick={() => { setMobileOpen(false); setEventsAccordionOpen(false) }}
                              className="px-3 py-2 rounded-md text-sm font-semibold text-brand-teal dark:text-white border-b border-border dark:border-dark-border mb-0.5 pb-2"
                            >
                              All Events
                            </Link>
                            <Link
                              href="/events/kustawi"
                              onClick={() => { setMobileOpen(false); setEventsAccordionOpen(false) }}
                              className="px-3 py-2 rounded-md text-sm text-text-muted hover:text-brand-teal dark:hover:text-white transition-colors"
                            >
                              Kustawi Events
                            </Link>
                            <Link
                              href="/events/other"
                              onClick={() => { setMobileOpen(false); setEventsAccordionOpen(false) }}
                              className="px-3 py-2 rounded-md text-sm text-text-muted hover:text-brand-teal dark:hover:text-white transition-colors"
                            >
                              Other Events
                            </Link>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                }

                if (slug === 'reading-list') {
                  return (
                    <div key={href}>
                      <button
                        onClick={() => setReadingListAccordionOpen((v) => !v)}
                        className={cn(
                          'w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer',
                          isActive
                            ? 'bg-surface dark:bg-dark-surface text-brand-teal dark:text-white'
                            : 'text-text-muted hover:text-brand-teal dark:hover:text-white'
                        )}
                      >
                        {label}
                        {readingListAccordionOpen
                          ? <ChevronUp className="h-3.5 w-3.5 opacity-60" />
                          : <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                        }
                      </button>
                      <AnimatePresence>
                        {readingListAccordionOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.15, ease: 'easeOut' }}
                            className="overflow-hidden pl-4 flex flex-col gap-0.5 mt-0.5"
                          >
                            <Link
                              href="/reading-list"
                              onClick={() => { setMobileOpen(false); setReadingListAccordionOpen(false) }}
                              className="px-3 py-2 rounded-md text-sm font-semibold text-brand-teal dark:text-white border-b border-border dark:border-dark-border mb-0.5 pb-2"
                            >
                              All Reading List
                            </Link>
                            <Link
                              href="/reading-list/book-of-the-month"
                              onClick={() => { setMobileOpen(false); setReadingListAccordionOpen(false) }}
                              className="px-3 py-2 rounded-md text-sm text-text-muted hover:text-brand-teal dark:hover:text-white transition-colors"
                            >
                              Book of the Month
                            </Link>
                            <Link
                              href="/reading-list/bibliography"
                              onClick={() => { setMobileOpen(false); setReadingListAccordionOpen(false) }}
                              className="px-3 py-2 rounded-md text-sm text-text-muted hover:text-brand-teal dark:hover:text-white transition-colors"
                            >
                              Bibliography
                            </Link>
                            <Link
                              href="/reading-list/theses"
                              onClick={() => { setMobileOpen(false); setReadingListAccordionOpen(false) }}
                              className="px-3 py-2 rounded-md text-sm text-text-muted hover:text-brand-teal dark:hover:text-white transition-colors"
                            >
                              MA and PhD Theses
                            </Link>
                            <Link
                              href="/reading-list/bookstores"
                              onClick={() => { setMobileOpen(false); setReadingListAccordionOpen(false) }}
                              className="px-3 py-2 rounded-md text-sm text-text-muted hover:text-brand-teal dark:hover:text-white transition-colors"
                            >
                              Bookstores
                            </Link>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                }

                if (slug === 'about') {
                  return (
                    <div key={href}>
                      <button
                        onClick={() => setAboutAccordionOpen((v) => !v)}
                        className={cn(
                          'w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer',
                          isActive
                            ? 'bg-surface dark:bg-dark-surface text-brand-teal dark:text-white'
                            : 'text-text-muted hover:text-brand-teal dark:hover:text-white'
                        )}
                      >
                        {label}
                        {aboutAccordionOpen
                          ? <ChevronUp className="h-3.5 w-3.5 opacity-60" />
                          : <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                        }
                      </button>
                      <AnimatePresence>
                        {aboutAccordionOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.15, ease: 'easeOut' }}
                            className="overflow-hidden pl-4 flex flex-col gap-0.5 mt-0.5"
                          >
                            <Link
                              href="/values"
                              onClick={() => { setMobileOpen(false); setAboutAccordionOpen(false) }}
                              className="px-3 py-2 rounded-md text-sm text-text-muted hover:text-brand-teal dark:hover:text-white transition-colors"
                            >
                              Mission &amp; Values
                            </Link>
                            <Link
                              href="/about"
                              onClick={() => { setMobileOpen(false); setAboutAccordionOpen(false) }}
                              className="px-3 py-2 rounded-md text-sm text-text-muted hover:text-brand-teal dark:hover:text-white transition-colors"
                            >
                              Founder
                            </Link>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                }

                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-surface dark:bg-dark-surface text-brand-teal dark:text-white'
                        : 'text-text-muted hover:text-brand-teal dark:hover:text-white'
                    )}
                  >
                    {label}
                  </Link>
                )
              })}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
