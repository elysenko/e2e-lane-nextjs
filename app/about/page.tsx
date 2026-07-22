import Link from 'next/link';

export const metadata = {
  title: 'About · Recipe Box',
};

export default function AboutPage() {
  return (
    <div data-testid="about-main">
      <div className="page-head">
        <div>
          <h1 className="page-title" data-testid="about-heading">
            About Recipe Box
          </h1>
        </div>
      </div>

      <div className="card prose">
        <p className="lead">
          Recipe Box is a simple, no-fuss place to collect the meals you love. Browse your
          recipes, add new ones in seconds, and never lose track of a favourite again.
        </p>
        <p>
          There are no accounts and nothing to set up — just open the app and start cooking.
          Every fresh copy comes with a few example recipes so the box is never empty.
        </p>

        <div className="feature-grid">
          <div className="feature">
            <div aria-hidden="true">📖</div>
            <h3>Browse</h3>
            <p>See every recipe at a glance with a title and short description.</p>
          </div>
          <div className="feature">
            <div aria-hidden="true">➕</div>
            <h3>Add</h3>
            <p>Save a new recipe with a single title field — details can come later.</p>
          </div>
          <div className="feature">
            <div aria-hidden="true">⚡</div>
            <h3>Fast</h3>
            <p>Lightweight and instant, on your phone or your laptop.</p>
          </div>
        </div>

        <p style={{ marginTop: 20 }}>
          <Link href="/recipes" className="btn btn-primary" data-testid="about-cta">
            Browse recipes
          </Link>
        </p>
      </div>
    </div>
  );
}
