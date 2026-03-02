'use client';

import React from 'react';
import { Header } from '@/components/site/header';
import { Hero } from '@/components/landing/hero';
import { Proof } from '@/components/landing/proof';
import { Features } from '@/components/landing/features';
import { Workflow } from '@/components/landing/workflow';
import { Outcomes } from '@/components/landing/outcomes';
import { Faq } from '@/components/landing/faq';
import { FinalCta } from '@/components/landing/final-cta';
import { Footer } from '@/components/site/footer';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white selection:bg-blue-600 selection:text-white antialiased">
      <Header variant="landing" />
      <main>
        <Hero />
        <Proof />
        <Features />
        <Workflow />
        <Outcomes />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
