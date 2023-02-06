import { getAbsoluteLink } from './utils/links'

const meLinks = {
  text: 'Me',
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
      text: 'AI-genearted Blog',
      href: getAbsoluteLink('/projects/ai_blog/blog'),
    },
    {
      text: 'Buy A Random Meme',
      href: getAbsoluteLink('/projects/buy_a_random_meme'),
    },
    {
      text: 'The Button',
      href: getAbsoluteLink('/projects/the_button'),
    },
  ],
}

export const headerData = {
  links: [meLinks, projectLinks],
  actions: [
    {
      type: 'button',
      text: 'Hire Me',
      href: 'mailto:gshively11+ihopethisworks@gmail.com',
    },
  ],
}

export const footerData = {
  links: [meLinks, projectLinks],
  secondaryLinks: [
    { text: 'Terms', href: getAbsoluteLink('/terms') },
    { text: 'Privacy Policy', href: getAbsoluteLink('/privacy') },
  ],
  socialLinks: [
    {
      ariaLabel: 'Github',
      icon: 'tabler:brand-github',
      href: 'https://github.com/gshively11',
    },
  ],
  footNote: `
    Made by Grant Shively, inspired by <a class="text-blue-600 hover:underline dark:text-gray-200" href="https://github.com/onwidget/astrowind"> Astrowind</a> · All rights reserved.
  `,
}
