
// This file is now a barrel file that re-exports from the new modularized services
import frontendServices from './frontend';
export default frontendServices;

// Re-export individual functions for backwards compatibility
export const {
  getNavigationMenu,
  getFooterInfo,
  getHeroSlides,
  getStudentStories,
  getFeaturedPrograms,
  getFeaturedProgramsIntro,
  getTaglineSection,
  getFrontendFormContent,
  submitPlanningForm,
  submitNewsletterSubscription
} = frontendServices;
