// Mapping function to convert archetype names to image filenames
export function getArchetypeImage(archetypeName: string): string {
  // Convert archetype name to lowercase and remove spaces and special characters
  const normalizedName = archetypeName.toLowerCase().replace(/[^a-z0-9]/g, "");

  // Mapping of normalized archetype names to image filenames
  const archetypeImageMap: Record<string, string> = {
    thestrategist: "/image/survey/archtype/mascot-thestrategist.webp",
    theadvocate: "/image/survey/archtype/mascot-theadvocate.webp",
    theinnovator: "/image/survey/archtype/mascot-theInnovator.webp",
    thearchitect: "/image/survey/archtype/mascot-thearchitect.webp",
    theartisansangperajin: "/image/survey/archtype/mascot-theartisan.webp",
    thebuildersangpembangun: "/image/survey/archtype/mascot-thebuilder.webp",
    theguardiansangpenjaga: "/image/survey/archtype/mascot-theguardian.webp",
    thesagesangbijak: "/image/survey/archtype/mascot-theguardian.webp",
  };

  // Return the corresponding image or a default image if not found
  return archetypeImageMap[normalizedName] || "/icon/ico-walk-3.webp";
}

// Function to get archetype display name (optional, for consistent formatting)
export function getArchetypeDisplayName(archetypeName: string): string {
  const nameMap: Record<string, string> = {
    "The Strategist": "The Strategist",
    "The Advocate": "The Advocate",
    "The Innovator": "The Innovator",
    "The Architect": "The Architect",
    "The Artisan": "The Artisan",
    "The Builder": "The Builder",
    "The Guardian": "The Guardian",
    "The Sage": "The Sage",
  };

  return nameMap[archetypeName] || archetypeName;
}

// Mapping function to convert learning mode names to image filenames
export function getLearningModeImage(learningMode: string): string {
  // Convert learning mode to lowercase and remove spaces and special characters
  const normalizedMode = learningMode.toLowerCase().replace(/[^a-z0-9]/g, "");

  // Mapping of normalized learning mode names to image filenames
  const learningModeImageMap: Record<string, string> = {
    audiotory: "/image/survey/learning/mascot-audiotory.webp",
    auditori: "/image/survey/learning/mascot-audiotory.webp",
    kinesthetic: "/image/survey/learning/mascot-kinesthetic.webp",
    visual: "/image/survey/learning/mascot-visual.webp",
  };

  // Return the corresponding image or a default image if not found
  return learningModeImageMap[normalizedMode] || "/icon/ico-walk-3.webp";
}
