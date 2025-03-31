import { SeoAnalysisResult } from "@shared/schema";

// Helper function to ensure URL has protocol
export function ensureProtocol(url: string): string {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return 'https://' + url;
  }
  return url;
}

// Main function to analyze SEO
export async function analyzeUrl(urlInput: string): Promise<SeoAnalysisResult> {
  try {
    const url = ensureProtocol(urlInput);
    
    // For GitHub Pages deployment, we use a CORS proxy to fetch HTML
    const corsProxyUrl = 'https://corsproxy.io/?';
    const response = await fetch(corsProxyUrl + encodeURIComponent(url));
    
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
    }
    
    const html = await response.text();
    
    // Create a DOM parser to parse the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Extract meta tags
    const metaTags: Record<string, string> = {};
    const metaElements = doc.querySelectorAll('meta');
    
    metaElements.forEach((meta) => {
      if (meta.hasAttribute('name') && meta.hasAttribute('content')) {
        metaTags[meta.getAttribute('name')!] = meta.getAttribute('content')!;
      } else if (meta.hasAttribute('property') && meta.hasAttribute('content')) {
        metaTags[meta.getAttribute('property')!] = meta.getAttribute('content')!;
      }
    });
    
    // Get title
    const title = doc.querySelector('title')?.textContent || '';
    metaTags['title'] = title;
    
    // Analyze the meta tags
    return analyzeMetaTags(metaTags, url);
  } catch (error) {
    console.error('Error analyzing URL:', error);
    throw error;
  }
}

function analyzeMetaTags(metaTags: Record<string, string>, url: string): SeoAnalysisResult {
  // Check for essential tags
  const title = metaTags['title'] || '';
  const description = metaTags['description'] || '';
  const ogTitle = metaTags['og:title'] || '';
  const ogDescription = metaTags['og:description'] || '';
  const ogImage = metaTags['og:image'] || '';
  const twitterCard = metaTags['twitter:card'] || '';
  const twitterTitle = metaTags['twitter:title'] || '';
  const twitterDescription = metaTags['twitter:description'] || '';
  const twitterImage = metaTags['twitter:image'] || '';
  
  // Calculate score based on available tags
  let score = 0;
  let maxScore = 100;
  
  // Title presence and length
  if (title) {
    score += 15;
    const titleLength = title.length;
    if (titleLength < 30) score -= 5;
    else if (titleLength > 60) score -= 7;
  } else {
    maxScore -= 15;
  }
  
  // Description presence and length
  if (description) {
    score += 15;
    const descLength = description.length;
    if (descLength < 70) score -= 5;
    else if (descLength > 160) score -= 7;
  } else {
    maxScore -= 15;
  }
  
  // OG tags
  if (ogTitle) score += 10;
  if (ogDescription) score += 10;
  if (ogImage) score += 10;
  
  // Twitter tags
  if (twitterCard) score += 5;
  if (twitterTitle || ogTitle) score += 5;
  if (twitterDescription || ogDescription) score += 5;
  if (twitterImage || ogImage) score += 5;
  
  // Canonical tag
  if (metaTags['canonical']) score += 10;
  
  // Robots tag
  if (metaTags['robots']) score += 5;
  
  // Viewport tag
  if (metaTags['viewport']) score += 5;
  
  // Calculate percentage
  const finalScore = Math.round((score / maxScore) * 100);
  
  // Create the result with all SEO data
  const tags = [
    {
      name: 'title',
      value: title,
      status: title ? 'present' as const : 'missing' as const,
      category: 'essential' as const
    },
    {
      name: 'description',
      value: description,
      status: description ? 'present' as const : 'missing' as const,
      category: 'essential' as const
    },
    {
      name: 'og:title',
      value: ogTitle,
      status: ogTitle ? 'present' as const : 'missing' as const,
      category: 'opengraph' as const
    },
    {
      name: 'og:description',
      value: ogDescription,
      status: ogDescription ? 'present' as const : 'missing' as const,
      category: 'opengraph' as const
    },
    {
      name: 'og:image',
      value: ogImage,
      status: ogImage ? 'present' as const : 'missing' as const,
      category: 'opengraph' as const
    },
    {
      name: 'twitter:card',
      value: twitterCard,
      status: twitterCard ? 'present' as const : 'missing' as const,
      category: 'twitter' as const
    },
    {
      name: 'twitter:title',
      value: twitterTitle,
      status: twitterTitle ? 'present' as const : 'missing' as const,
      category: 'twitter' as const
    },
    {
      name: 'twitter:description',
      value: twitterDescription,
      status: twitterDescription ? 'present' as const : 'missing' as const,
      category: 'twitter' as const
    },
    {
      name: 'twitter:image',
      value: twitterImage,
      status: twitterImage ? 'present' as const : 'missing' as const,
      category: 'twitter' as const
    },
    {
      name: 'canonical',
      value: metaTags['canonical'] || '',
      status: metaTags['canonical'] ? 'present' as const : 'missing' as const,
      category: 'technical' as const
    },
    {
      name: 'robots',
      value: metaTags['robots'] || '',
      status: metaTags['robots'] ? 'present' as const : 'missing' as const,
      category: 'technical' as const
    },
    {
      name: 'viewport',
      value: metaTags['viewport'] || '',
      status: metaTags['viewport'] ? 'present' as const : 'missing' as const,
      category: 'technical' as const
    }
  ];
  
  // Prepare recommendations
  const critical = [];
  const improvements = [];
  
  if (!title) {
    critical.push({
      title: 'Missing page title',
      description: 'Your page is missing a title tag, which is crucial for SEO.',
      solution: '<title>Your Page Title Here</title>'
    });
  } else if (title.length > 60) {
    improvements.push({
      title: 'Title too long',
      description: 'Your title exceeds 60 characters and may be truncated in search results.',
      solution: 'Shorten your title to less than 60 characters.'
    });
  }
  
  if (!description) {
    critical.push({
      title: 'Missing meta description',
      description: 'Your page is missing a meta description, which helps improve click-through rates.',
      solution: '<meta name="description" content="Your page description here (150-160 characters optimal)" />'
    });
  } else if (description.length > 160) {
    improvements.push({
      title: 'Description too long',
      description: 'Your description exceeds 160 characters and may be truncated in search results.',
      solution: 'Shorten your description to 150-160 characters.'
    });
  }
  
  if (!ogTitle || !ogDescription || !ogImage) {
    improvements.push({
      title: 'Missing Open Graph tags',
      description: 'Open Graph tags improve how your site appears when shared on social media.',
      solution: `<meta property="og:title" content="Your Title" />
<meta property="og:description" content="Your Description" />
<meta property="og:image" content="https://example.com/image.jpg" />
<meta property="og:url" content="${url}" />`
    });
  }
  
  if (!twitterCard) {
    improvements.push({
      title: 'Missing Twitter Card tags',
      description: 'Twitter Card tags improve how your site appears when shared on Twitter.',
      solution: `<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Your Title" />
<meta name="twitter:description" content="Your Description" />
<meta name="twitter:image" content="https://example.com/image.jpg" />`
    });
  }
  
  // Count essential, social, and technical tags
  const essential = tags.filter(tag => tag.category === 'essential');
  const social = tags.filter(tag => tag.category === 'opengraph' || tag.category === 'twitter');
  const technical = tags.filter(tag => tag.category === 'technical');
  
  // Count present tags
  const essentialPresent = essential.filter(tag => tag.status === 'present').length;
  const socialPresent = social.filter(tag => tag.status === 'present').length;
  const technicalPresent = technical.filter(tag => tag.status === 'present').length;

  return {
    score: finalScore,
    url,
    title: title,
    description: description,
    tags,
    googlePreview: {
      title: title || url,
      url: url,
      description: description
    },
    recommendations: {
      critical,
      improvements
    },
    socialPreviews: {
      facebook: {
        title: ogTitle || title,
        description: ogDescription || description,
        image: ogImage
      },
      twitter: {
        cardType: twitterCard,
        title: twitterTitle || ogTitle || title,
        description: twitterDescription || ogDescription || description,
        image: twitterImage || ogImage
      }
    },
    statusSummary: {
      essential: {
        present: essentialPresent,
        total: essential.length
      },
      social: {
        present: socialPresent,
        total: social.length
      },
      technical: {
        present: technicalPresent,
        total: technical.length
      }
    }
  };
}