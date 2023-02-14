/**
 * Data used throughout the app, centralized in this file to make it easier to manage.
 */

import { getAbsoluteLink } from './utils/links'

const meLinks = {
  text: 'Socials',
  links: [
    {
      text: 'Github',
      href: 'https://github.com/gshively11',
    },
    {
      text: 'LinkedIn',
      href: 'https://linkedin.com/in/grant-shively',
    },
  ],
}

const projectLinks = {
  text: 'Projects',
  links: [
    {
      text: 'Summary',
      href: getAbsoluteLink('/projects/summary'),
    },
    {
      text: 'AI-generated Blog',
      href: getAbsoluteLink('/projects/ai_blog/blog'),
    },
    {
      text: 'The Button',
      href: getAbsoluteLink('/projects/the_button'),
    },
  ],
}

// Change the name the Summary page to Projects for the footer.
const projectFooterLinks = { ...projectLinks, links: [...projectLinks.links] }
projectFooterLinks.links[0] = { ...projectFooterLinks.links[0], text: 'Projects' }

export const headerData = {
  links: [
    {
      text: 'Home',
      href: getAbsoluteLink('/'),
    },
    projectLinks,
    meLinks,
  ],
  actions: [
    {
      type: 'button',
      text: 'Hire Me',
      href: 'mailto:gshively11+ihopethisworks@gmail.com',
    },
  ],
}

export const footerData = {
  links: [projectFooterLinks, meLinks],
  secondaryLinks: [],
  socialLinks: [
    {
      ariaLabel: 'Github',
      icon: 'tabler:brand-github',
      href: 'https://github.com/gshively11',
    },
    {
      ariaLabel: 'LinkedIn',
      icon: 'tabler:brand-linkedin',
      href: 'https://linkedin.com/in/grant-shively',
    },
  ],
  footNote: `
    Made by Grant Shively, inspired by <a class="text-blue-600 hover:underline dark:text-gray-200" target="_blank" href="https://github.com/onwidget/astrowind"> Astrowind</a> · All rights reserved.
  `,
}
