import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import type { SeoAnalysisResult, SeoTag } from '@shared/schema';

// Helper to ensure URL has protocol
function ensureProtocol(url: string): string {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
}

// Main function to analyze a URL's SEO tags
export async function seoAnalyzeUrl(urlInput: string): Promise<SeoAnalysisResult> {
  const url = ensureProtocol(urlInput);
  
  try {
    // Fetch the HTML
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch the URL: ${response.statusText}`);
    }
    
    const html = await response.text();
    
    // Parse the HTML with cheerio
    const $ = cheerio.load(html);
    
    // Extract all meta tags
    const metaTags: Record<string, string> = {};
    
    // Extract standard meta tags
    $('meta').each((_, element) => {
      const name = $(element).attr('name') || $(element).attr('property') || $(element).attr('http-equiv');
      const content = $(element).attr('content');
      
      if (name && content) {
        metaTags[name] = content;
      }
    });
    
    // Extract title
    const title = $('title').text() || '';
    metaTags['title'] = title;
    
    // Extract canonical URL
    const canonical = $('link[rel="canonical"]').attr('href') || '';
    metaTags['canonical'] = canonical;
    
    // Extract favicon
    const favicon = $('link[rel="icon"], link[rel="shortcut icon"]').attr('href') || '';
    metaTags['favicon'] = favicon ? new URL(favicon, url).href : '';
    
    // Analyze the meta tags
    const analysis = analyzeMetaTags(metaTags, url);
    
    return analysis;
  } catch (error) {
    console.error('Error fetching or analyzing URL:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to analyze URL');
  }
}

// Function to analyze meta tags and create the analysis result
function analyzeMetaTags(metaTags: Record<string, string>, url: string): SeoAnalysisResult {
  const tags: SeoTag[] = [];
  const critical: SeoAnalysisResult['recommendations']['critical'] = [];
  const improvements: SeoAnalysisResult['recommendations']['improvements'] = [];
  
  // Extract and check title
  const title = metaTags['title'] || '';
  const titleStatus = title ? (title.length < 30 || title.length > 60 ? 'needs_improvement' : 'present') : 'missing';
  
  tags.push({
    name: 'Title Tag',
    value: title,
    category: 'essential',
    status: titleStatus,
    recommendation: titleStatus === 'present' 
      ? `Good length (${title.length} characters). Aim for 50-60 characters.`
      : titleStatus === 'needs_improvement'
        ? `${title.length < 30 ? 'Too short' : 'Too long'} (${title.length} characters). Aim for 50-60 characters.`
        : 'Missing title tag. Add a descriptive title.'
  });
  
  if (titleStatus === 'missing') {
    critical.push({
      title: 'Missing Title Tag',
      description: 'Your page is missing a title tag, which is crucial for SEO.',
      solution: '<title>Your Page Title | Your Brand</title>',
      additionalInfo: 'The title tag is one of the most important elements for SEO and user experience.'
    });
  } else if (titleStatus === 'needs_improvement') {
    improvements.push({
      title: `Title ${title.length < 30 ? 'Too Short' : 'Too Long'}`,
      description: `Your title is ${title.length < 30 ? 'too short' : 'too long'} (${title.length} characters).`,
      solution: '<title>Your Optimal Length Title (50-60 characters) | Brand</title>',
      additionalInfo: 'The ideal title length is between 50-60 characters to display properly in search results.'
    });
  }
  
  // Extract and check meta description
  const description = metaTags['description'] || '';
  const descriptionStatus = description 
    ? (description.length < 120 || description.length > 160 ? 'needs_improvement' : 'present') 
    : 'missing';
  
  tags.push({
    name: 'Meta Description',
    value: description,
    category: 'essential',
    status: descriptionStatus,
    recommendation: descriptionStatus === 'present'
      ? `Good length (${description.length} characters). Aim for 150-160 characters.`
      : descriptionStatus === 'needs_improvement'
        ? `${description.length < 120 ? 'Too short' : 'Too long'} (${description.length} characters). Aim for 150-160 characters.`
        : 'Missing meta description. Add a concise summary of your page.'
  });
  
  if (descriptionStatus === 'missing') {
    critical.push({
      title: 'Missing Meta Description',
      description: 'Your page is missing a meta description tag.',
      solution: '<meta name="description" content="Your concise page description that is 150-160 characters long and includes relevant keywords for your content." />',
      additionalInfo: 'Meta descriptions help improve click-through rates from search results.'
    });
  } else if (descriptionStatus === 'needs_improvement') {
    improvements.push({
      title: `Description ${description.length < 120 ? 'Too Short' : 'Too Long'}`,
      description: `Your meta description is ${description.length < 120 ? 'too short' : 'too long'} (${description.length} characters).`,
      solution: '<meta name="description" content="Your optimal length description between 150-160 characters that accurately summarizes the page content and includes relevant keywords." />',
      additionalInfo: 'The ideal description length is between 150-160 characters.'
    });
  }
  
  // Check canonical URL
  const canonical = metaTags['canonical'] || '';
  const canonicalStatus = canonical ? 'present' : 'missing';
  
  tags.push({
    name: 'Canonical URL',
    value: canonical,
    category: 'essential',
    status: canonicalStatus,
    recommendation: canonicalStatus === 'present'
      ? 'Canonical URL is properly set.'
      : 'Missing canonical tag. Add a canonical URL to prevent duplicate content issues.'
  });
  
  if (canonicalStatus === 'missing') {
    critical.push({
      title: 'Missing Canonical URL Tag',
      description: 'Your page is missing a canonical URL tag.',
      solution: `<link rel="canonical" href="${url}" />`,
      additionalInfo: 'This helps prevent duplicate content issues when the same page is accessible via multiple URLs.'
    });
  }
  
  // Check Open Graph tags
  const ogTitle = metaTags['og:title'] || '';
  const ogDescription = metaTags['og:description'] || '';
  const ogImage = metaTags['og:image'] || '';
  const ogImageWidth = metaTags['og:image:width'] || '';
  const ogImageHeight = metaTags['og:image:height'] || '';
  const ogType = metaTags['og:type'] || '';
  
  tags.push({
    name: 'og:title',
    value: ogTitle,
    category: 'opengraph',
    status: ogTitle ? 'present' : 'missing',
    recommendation: 'Title for social media sharing'
  });
  
  tags.push({
    name: 'og:description',
    value: ogDescription,
    category: 'opengraph',
    status: ogDescription ? 'present' : 'missing',
    recommendation: 'Description for social media sharing'
  });
  
  tags.push({
    name: 'og:image',
    value: ogImage,
    category: 'opengraph',
    status: ogImage ? 'present' : 'missing',
    recommendation: 'Image for social media sharing'
  });
  
  tags.push({
    name: 'og:image:width',
    value: ogImageWidth,
    category: 'opengraph',
    status: ogImageWidth ? 'present' : 'missing',
    recommendation: 'Width of the OG image'
  });
  
  tags.push({
    name: 'og:image:height',
    value: ogImageHeight,
    category: 'opengraph',
    status: ogImageHeight ? 'present' : 'missing',
    recommendation: 'Height of the OG image'
  });
  
  tags.push({
    name: 'og:type',
    value: ogType,
    category: 'opengraph',
    status: ogType ? 'present' : 'missing',
    recommendation: 'Type of content (e.g., website, article)'
  });
  
  if (!ogTitle || !ogDescription || !ogImage) {
    improvements.push({
      title: 'Missing Open Graph Tags',
      description: 'Your page is missing essential Open Graph tags for social media sharing.',
      solution: `<meta property="og:title" content="${title || 'Your Title'}" />
<meta property="og:description" content="${description || 'Your Description'}" />
<meta property="og:image" content="https://example.com/image.jpg" />
<meta property="og:url" content="${url}" />
<meta property="og:type" content="website" />`,
      additionalInfo: 'Open Graph tags improve how your content appears when shared on social media platforms like Facebook.'
    });
  }
  
  if (ogImage && (!ogImageWidth || !ogImageHeight)) {
    improvements.push({
      title: 'Add Open Graph Image Dimensions',
      description: 'Your page has an og:image tag but is missing the image dimensions.',
      solution: `<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />`,
      additionalInfo: 'This improves rendering in Facebook and other platforms that use Open Graph.'
    });
  }
  
  // Check Twitter Card tags
  const twitterCard = metaTags['twitter:card'] || '';
  const twitterTitle = metaTags['twitter:title'] || '';
  const twitterDescription = metaTags['twitter:description'] || '';
  const twitterImage = metaTags['twitter:image'] || '';
  
  tags.push({
    name: 'twitter:card',
    value: twitterCard,
    category: 'twitter',
    status: twitterCard ? 'present' : 'missing',
    recommendation: 'Defines the type of Twitter card'
  });
  
  tags.push({
    name: 'twitter:title',
    value: twitterTitle,
    category: 'twitter',
    status: twitterTitle ? 'present' : 'missing',
    recommendation: 'Title for Twitter sharing'
  });
  
  tags.push({
    name: 'twitter:description',
    value: twitterDescription,
    category: 'twitter',
    status: twitterDescription ? 'present' : 'missing',
    recommendation: 'Description for Twitter sharing'
  });
  
  tags.push({
    name: 'twitter:image',
    value: twitterImage,
    category: 'twitter',
    status: twitterImage ? 'present' : 'missing',
    recommendation: 'Image for Twitter sharing'
  });
  
  if (!twitterCard || !twitterImage) {
    improvements.push({
      title: 'Add Twitter Card Tags',
      description: 'Your page is missing essential Twitter Card tags for better sharing on Twitter.',
      solution: `<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${title || ogTitle || 'Your Title'}" />
<meta name="twitter:description" content="${description || ogDescription || 'Your Description'}" />
<meta name="twitter:image" content="https://example.com/image.jpg" />`,
      additionalInfo: 'Twitter Card tags help control how your content appears when shared on Twitter.'
    });
  }
  
  // Check viewport meta tag
  const viewport = metaTags['viewport'] || '';
  tags.push({
    name: 'Viewport',
    value: viewport,
    category: 'technical',
    status: viewport ? 'present' : 'missing',
    recommendation: viewport 
      ? 'Viewport is properly set for responsive design.'
      : 'Missing viewport meta tag. Add it for better mobile rendering.'
  });
  
  if (!viewport) {
    improvements.push({
      title: 'Missing Viewport Meta Tag',
      description: 'Your page is missing a viewport meta tag for responsive design.',
      solution: '<meta name="viewport" content="width=device-width, initial-scale=1.0" />',
      additionalInfo: 'The viewport meta tag is essential for mobile-friendly pages, which is a ranking factor for search engines.'
    });
  }
  
  // Calculate counts and score
  const essentialTags = tags.filter(tag => tag.category === 'essential');
  const essentialPresent = essentialTags.filter(tag => tag.status === 'present').length;
  const essentialTotal = essentialTags.length;
  
  const socialTags = tags.filter(tag => tag.category === 'opengraph' || tag.category === 'twitter');
  const socialPresent = socialTags.filter(tag => tag.status === 'present').length;
  const socialTotal = socialTags.length;
  
  const technicalTags = tags.filter(tag => tag.category === 'technical');
  const technicalPresent = technicalTags.filter(tag => tag.status === 'present').length;
  const technicalTotal = technicalTags.length;
  
  // Calculate overall score (weighted average)
  const essentialWeight = 0.5;
  const socialWeight = 0.3;
  const technicalWeight = 0.2;
  
  const essentialScore = essentialTotal > 0 ? (essentialPresent / essentialTotal) * 100 : 0;
  const socialScore = socialTotal > 0 ? (socialPresent / socialTotal) * 100 : 0;
  const technicalScore = technicalTotal > 0 ? (technicalPresent / technicalTotal) * 100 : 0;
  
  const overallScore = Math.round(
    (essentialScore * essentialWeight) +
    (socialScore * socialWeight) +
    (technicalScore * technicalWeight)
  );
  
  // Create the domain for display
  let displayUrl = url;
  try {
    const urlObj = new URL(url);
    displayUrl = urlObj.hostname + urlObj.pathname;
  } catch (e) {
    // Keep the original URL if parsing fails
  }
  
  // Generate the result object
  return {
    url,
    title,
    description,
    favicon: metaTags['favicon'] || '',
    tags,
    score: overallScore,
    googlePreview: {
      title: title || 'No title',
      url: displayUrl,
      description: description || 'No description available',
    },
    socialPreviews: {
      facebook: {
        title: ogTitle || title || 'No title',
        description: ogDescription || description || '',
        image: ogImage || '',
      },
      twitter: {
        title: twitterTitle || ogTitle || title || 'No title',
        description: twitterDescription || ogDescription || description || '',
        image: twitterImage || ogImage || '',
        cardType: twitterCard || '',
      },
    },
    recommendations: {
      critical,
      improvements,
    },
    statusSummary: {
      essential: {
        present: essentialPresent,
        total: essentialTotal,
      },
      social: {
        present: socialPresent,
        total: socialTotal,
      },
      technical: {
        present: technicalPresent,
        total: technicalTotal,
      },
    },
  };
}
