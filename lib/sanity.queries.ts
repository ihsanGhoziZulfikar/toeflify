import { groq } from 'next-sanity';

// listing section
export const sectionsListingQuery = groq`
  *[_type == "section"] | order(order asc) {
    _id,
    name,
    "slug": slug.current,
    coverImage,
    excerpt,
    description
  }
`;

//  detail section by slug
export const sectionBySlugQuery = groq`
  *[_type == "section" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    coverImage,
    description,
    "chapters": chapters[] | order(order asc) {
      _key,
      name,
      "slug": slug.current,
      coverImage,
      description,
      "topicGroups": topicGroups[] {
        _key,
        name,
        "slug": slug.current,
        coverImage,
        description,
        "skills": skills[] | order(order asc) {
          _key,
          name,
          "slug": slug.current,
          coverImage,
          description,
          content,
          exercise
        }
      }
    },
    "totalChapters": count(chapters),
    "totalTopics": count(chapters[].topicGroups[]),
    "totalSkills": count(chapters[].topicGroups[].skills[])
  }
`;

//
export const sectionPathsQuery = groq`
  *[_type == "section" && defined(slug.current)]{
    "slug": slug.current
  }
`;
