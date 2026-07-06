// server/components/layout.js
// Reads base HTML shells and replaces {{placeholders}} with built HTML strings
// Every route calls cmsPage() or publicPage() — nothing renders outside of these

const fs   = require('fs')
const path = require('path')

// Cache base files in memory — read once, reuse forever
const BASE_CMS    = fs.readFileSync(path.join(__dirname, '../views/base-cms.html'),    'utf8')
const BASE_PUBLIC = fs.readFileSync(path.join(__dirname, '../views/base-public.html'), 'utf8')

const { Sidebar }              = require('./nav')
const { TopbarRight }          = require('./nav')
const { NotificationList }     = require('./notification')
const { PublicActiveNav }      = require('./public-nav')

// ── CMS LAYOUT ───────────────────────────────────────────────────────────────

function cmsPage({ title, activeFeature, user, main, notifications = '', modal = '' }) {
  return BASE_CMS
    .replace('{{title}}',        title || 'Dashboard')
    .replace('{{topbar-right}}', TopbarRight(user))
    .replace('{{sidebar}}',      Sidebar(activeFeature, user))
    .replace('{{main}}',         main)
    .replace('{{notifications}}', NotificationList(notifications))
    .replace('{{modal}}',        modal)
}

// ── PUBLIC LAYOUT ─────────────────────────────────────────────────────────────

const OG_IMAGE = 'https://mlab.co.za/assets/og-image.png' // update with real domain

function publicPage({ activePage, title, description, url, main }) {
  const year = new Date().getFullYear()

  return BASE_PUBLIC
    .replace(/\{\{og:title\}\}/g,       title       || 'mLab — Digital Skills and Innovation')
    .replace(/\{\{og:description\}\}/g, description || 'Building certified digital talent and supporting entrepreneurs across South Africa.')
    .replace(/\{\{og:image\}\}/g,       OG_IMAGE)
    .replace(/\{\{og:url\}\}/g,         url         || 'https://mlab.co.za')
    .replace('{{main}}',                main)
    .replace('{{year}}',                year)
    // Active nav link — adds --active modifier to current page link
    .replace('{{active:home}}',         activePage === 'home'      ? 'public-nav__link--active' : '')
    .replace('{{active:provinces}}',    activePage === 'provinces' ? 'public-nav__link--active' : '')
    .replace('{{active:resources}}',    activePage === 'resources' ? 'public-nav__link--active' : '')
    .replace('{{active:about}}',        activePage === 'about'     ? 'public-nav__link--active' : '')
    .replace('{{active:contact}}',      activePage === 'contact'   ? 'public-nav__link--active' : '')
}

module.exports = { cmsPage, publicPage }