/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { animate } from 'motion';

let currentScrollAnimation: any = null;

/**
 * Animates page scroll to a specific vertical position (Y).
 *
 * @param targetY The target scroll position in pixels.
 * @param durationMs Duration of the animation in milliseconds (defaults to 800ms).
 */
export const animateScrollTo = (targetY: number, durationMs: number = 800) => {
  if (currentScrollAnimation) {
    currentScrollAnimation.stop();
  }

  const html = document.documentElement;
  const originalScrollBehavior = html.style.scrollBehavior;
  
  // Disable native smooth scroll during our JS animation to avoid stuttering/conflict
  html.style.scrollBehavior = 'auto';

  const startY = window.scrollY;

  // If start is already at the target, we don't need to animate
  if (Math.abs(startY - targetY) < 1) {
    return;
  }

  currentScrollAnimation = animate(startY, targetY, {
    duration: durationMs / 1000,
    ease: [0.25, 0.1, 0.25, 1.0], // Ultra-premium ease-in-out curve
    onUpdate: (latest) => {
      window.scrollTo(0, latest);
    },
    onComplete: () => {
      html.style.scrollBehavior = originalScrollBehavior;
      currentScrollAnimation = null;
    }
  });
};

/**
 * Animates page scroll to a specific element by ID.
 *
 * @param id The HTML element ID to scroll to.
 * @param durationMs Duration of the animation in milliseconds (defaults to 800ms).
 */
export const animateScrollToElement = (id: string, durationMs: number = 800) => {
  const el = document.getElementById(id);
  if (!el) return;

  const rect = el.getBoundingClientRect();
  const style = window.getComputedStyle(el);
  const scrollMarginTop = parseInt(style.scrollMarginTop) || 80;

  const targetY = Math.max(0, rect.top + window.scrollY - scrollMarginTop);
  animateScrollTo(targetY, durationMs);
};
