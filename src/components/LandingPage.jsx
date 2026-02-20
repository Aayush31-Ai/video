import { Link } from 'react-router-dom';
import { Upload, Video, Sparkles, ArrowRight, Building2, Camera, Clapperboard } from 'lucide-react';
import styles from './LandingPage.module.css';

export default function LandingPage() {
  return (
    <div className={styles.landing}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <Sparkles size={14} />
            <span>Powered by Google Gemini & Veo 3.1</span>
          </div>

          <h1 className={styles.title}>
            Transform Property Photos into
            <span className={styles.gradient}> Cinematic Walkthroughs</span>
          </h1>

          <p className={styles.subtitle}>
            Upload a single image of any property and our AI generates a smooth,
            professional virtual walkthrough video in minutes. Perfect for real estate
            agents, property managers, and architects.
          </p>

          <div className={styles.heroActions}>
            <Link to="/generate" className={styles.primaryBtn}>
              <Upload size={18} />
              <span>Start Generating</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>AI-Powered</span>
              <span className={styles.statLabel}>Video Generation</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statValue}>16:9</span>
              <span className={styles.statLabel}>Cinematic Output</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statValue}>1-Click</span>
              <span className={styles.statLabel}>Simple Upload</span>
            </div>
          </div>
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.mockupContainer}>
            <div className={styles.mockupWindow}>
              <div className={styles.mockupHeader}>
                <div className={styles.mockupDots}>
                  <span /><span /><span />
                </div>
              </div>
              <div className={styles.mockupBody}>
                <div className={styles.mockupImage}>
                  <Building2 size={48} strokeWidth={1} />
                  <p>Property Image</p>
                </div>
                <div className={styles.mockupArrow}>
                  <ArrowRight size={24} />
                </div>
                <div className={styles.mockupVideo}>
                  <Clapperboard size={48} strokeWidth={1} />
                  <p>Walkthrough Video</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.howItWorks}>
        <div className={styles.sectionHeader}>
          <h2>How It Works</h2>
          <p>Three simple steps to create your virtual walkthrough</p>
        </div>

        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>01</div>
            <div className={styles.stepIcon}>
              <Upload size={28} />
            </div>
            <h3>Upload Image</h3>
            <p>
              Drop in a photo of your property — exterior or interior shot.
              Supports JPG, PNG, and WebP.
            </p>
          </div>

          <div className={styles.stepConnector}>
            <ArrowRight size={20} />
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>02</div>
            <div className={styles.stepIcon}>
              <Sparkles size={28} />
            </div>
            <h3>AI Analyzes</h3>
            <p>
              Gemini AI analyzes architectural details, lighting, and layout
              to craft a cinematic walkthrough prompt.
            </p>
          </div>

          <div className={styles.stepConnector}>
            <ArrowRight size={20} />
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>03</div>
            <div className={styles.stepIcon}>
              <Video size={28} />
            </div>
            <h3>Get Video</h3>
            <p>
              Veo 3.1 generates a smooth, cinematic walkthrough video you can
              preview and download instantly.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={styles.features}>
        <div className={styles.sectionHeader}>
          <h2>Built for Real Estate</h2>
          <p>Everything you need to showcase properties beautifully</p>
        </div>

        <div className={styles.featureGrid}>
          {[
            {
              icon: <Camera size={24} />,
              title: 'Smart Image Analysis',
              desc: 'AI identifies rooms, architecture, lighting conditions, and design features from a single photo.',
            },
            {
              icon: <Clapperboard size={24} />,
              title: 'Cinematic Quality',
              desc: '16:9 widescreen output with smooth camera movements, professional pacing, and natural transitions.',
            },
            {
              icon: <Building2 size={24} />,
              title: 'Any Property Type',
              desc: 'Works with houses, apartments, commercial spaces, luxury villas, and more.',
            },
            {
              icon: <Sparkles size={24} />,
              title: 'AI-Crafted Narration',
              desc: 'Automatically generates descriptive walkthrough prompts tailored to your property.',
            },
          ].map((feature, i) => (
            <div key={i} className={styles.featureCard}>
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className={styles.ctaCard}>
          <h2>Ready to Create Your Walkthrough?</h2>
          <p>Upload a property image and let AI do the rest.</p>
          <Link to="/generate" className={styles.primaryBtn}>
            <Video size={18} />
            <span>Get Started Now</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>WalkThru AI — Virtual Real Estate Walkthrough Generator</p>
          <p className={styles.footerSub}>Powered by Google Gemini & Veo 3.1</p>
        </div>
      </footer>
    </div>
  );
}
