# AI-generated Blog

This project showcases a simple, yet stylish blog, with a twist. All of the content is automatically generated via [OpenAI's](https://openai.com/) Davinci and DALL·E APIs.

## Components

- [scripts/generate-ai-blog-post.mjs](/scripts/generate-ai-blog-post.mjs): This script uses the official OpenAI SDK to communicate with OpenAI's APIs to generate a ~200 word blog post, as well as an image that matches the central theme of the post. The content is written to disk within the project in a markdown format that [Astro](https://astro.build/) is capable of parsing.
- [src/pages/projects/ai_blog](/src/pages/projects/ai_blog): This location houses all the blog pages, but not the content itself.  We use Astro's [dynamic routes](https://docs.astro.build/en/core-concepts/routing/#dynamic-routes) to generate blog post pages at build time from the content generated by OpenAI. Most of this was already provided by the [Astrowind template](https://github.com/onwidget/astrowind) that served as the basis for this project.
- [src/content/post](/src/content/post): The content for each blog post exists as an individual markdown file in this location.
- [src/assets/images/posts](/src/assets/images/posts): All the blog post images exist here.
