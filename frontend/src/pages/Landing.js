import React from 'react';
import { Link } from 'react-router-dom';
import {
  CheckBadgeIcon,
  CalendarDaysIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import './Landing.css';

export default function Landing() {
  return (
    <div className="landing">
      {/* top-right login link */}
      <nav className="landing-nav">
        <div className="landing-logo">Habitify</div>
        <Link to="/login" className="btn-secondary nav-login">
          Log In
        </Link>
      </nav>

      {/* hero with only the primary CTA */}
      <header className="landing-hero">
        <div className="landing-hero-inner">
          <h1>Welcome to Habitify</h1>
          <p>Create tasks, build habits, and track your progress all in one place.</p>
          <div className="landing-cta">
            <Link to="/register" className="btn-primary">Get Started</Link>
          </div>
        </div>
      </header>

      {/* features stay the same */}
      <section className="landing-features">
        <div className="feature-card">
          <CheckBadgeIcon className="feature-icon" />
          <h3>Customizable To-Dos</h3>
          <p>Organize and prioritize your day with ease.</p>
        </div>
        <div className="feature-card">
          <CalendarDaysIcon className="feature-icon" />
          <h3>Habit Tracking</h3>
          <p>Set daily habits, maintain streaks, and stay motivated.</p>
        </div>
        <div className="feature-card">
          <ChartBarIcon className="feature-icon" />
          <h3>Insights &amp; Stats</h3>
          <p>Visualize your productivity over time.</p>
        </div>
      </section>

      <footer className="landing-footer">
        <p>&copy; {new Date().getFullYear()} Habitify. All rights reserved.</p>
      </footer>
    </div>
  );
}

