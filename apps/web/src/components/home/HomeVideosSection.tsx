import React from 'react';
import { useApp } from '../../context/AppContext';

export const HomeVideosSection: React.FC = () => {
  const { navigate } = useApp();

  const handleViewAll = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/videos');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="section_academy_videos padding-vertical-md">
      <div className="container">
        <div className="academy-guide_component">
          <div className="academy-guide_text-wrap">
            <h2 className="academy-heading-style">Essential trading tutorials</h2>
            <p>
              Dive into short, focused videos that show you how to apply concepts and navigate our trading platforms.
            </p>
            <div className="academy-guide_button-wrap">
              <a
                data-wf--design-system-enterprise-copy--link-arrow--variant="coral"
                href="/videos"
                onClick={handleViewAll}
                className="design-system-enterprise-copy--link design-system-enterprise-copy--is-arrow w-inline-block"
              >
                <div data-traking="button-text">See all videos</div>
                <div className="design-system-enterprise-copy--link_icon"></div>
              </a>
            </div>
          </div>
          <div className="academy_card_list">
            <div className="academy_card_item">
              <div className="design-system-enterprise-copy--video-card_component">
                <div className="design-system-enterprise-copy--video-card_link">
                  <div
                    style={{ paddingTop: '56.17021276595745%' }}
                    className="design-system-enterprise-copy--video-card_image-wrapper w-video w-embed"
                  >
                    <iframe
                      className="embedly-embed"
                      src="//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2F6DDIcy6prIk%3Ffeature%3Doembed&display_name=YouTube&url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D6DDIcy6prIk&image=https%3A%2F%2Fi.ytimg.com%2Fvi%2F6DDIcy6prIk%2Fhqdefault.jpg&type=text%2Fhtml&schema=youtube"
                      width="940"
                      height="528"
                      allowFullScreen
                      title="Options trading explained | Live demo | Deriv Trader"
                    />
                  </div>
                  <div className="design-system-enterprise-copy--video-card_text-wrapper">
                    <h3 fs-cmsfilter-field="" className="design-system-enterprise-copy--video-card_heading design-system-enterprise-copy--heading-style-h6">
                      Options trading explained | Live demo | Deriv Trader
                    </h3>
                    <p fs-cmsfilter-field="">
                      Learn how to trade Digital Options on Deriv Trader platform with Vince Stanzione, a veteran trader and New York Times bestselling author.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="academy_card_item">
              <div className="design-system-enterprise-copy--video-card_component">
                <div className="design-system-enterprise-copy--video-card_link">
                  <div
                    style={{ paddingTop: '56.17021276595745%' }}
                    className="design-system-enterprise-copy--video-card_image-wrapper w-video w-embed"
                  >
                    <iframe
                      className="embedly-embed"
                      src="//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FQUFXlUloGrA%3Ffeature%3Doembed&display_name=YouTube&url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DQUFXlUloGrA&image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FQUFXlUloGrA%2Fhqdefault.jpg&type=text%2Fhtml&schema=youtube"
                      width="940"
                      height="528"
                      allowFullScreen
                      title="How to trade Volatility Indices on Deriv MT5 | Live Demo"
                    />
                  </div>
                  <div className="design-system-enterprise-copy--video-card_text-wrapper">
                    <h3 fs-cmsfilter-field="" className="design-system-enterprise-copy--video-card_heading design-system-enterprise-copy--heading-style-h6">
                      How to trade Volatility Indices on Deriv MT5 | Live Demo
                    </h3>
                    <p fs-cmsfilter-field="">
                      Learn from Vince Stanzione, veteran trader and New York Times bestselling author, as he shares insights on how to navigate and trade Volatility Indices using the Deriv MT5.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="academy_card_item">
              <div className="design-system-enterprise-copy--video-card_component">
                <div className="design-system-enterprise-copy--video-card_link">
                  <div
                    style={{ paddingTop: '56.17021276595745%' }}
                    className="design-system-enterprise-copy--video-card_image-wrapper w-video w-embed"
                  >
                    <iframe
                      className="embedly-embed"
                      src="//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FduyAZr32tYI%3Ffeature%3Doembed&display_name=YouTube&url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DduyAZr32tYI&image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FduyAZr32tYI%2Fhqdefault.jpg&type=text%2Fhtml&schema=youtube"
                      width="940"
                      height="528"
                      allowFullScreen
                      title="How to trade Bitcoin on Deriv MT5 Live Demo: Step-by-Step Guide & Expert Tips"
                    />
                  </div>
                  <div className="design-system-enterprise-copy--video-card_text-wrapper">
                    <h3 fs-cmsfilter-field="" className="design-system-enterprise-copy--video-card_heading design-system-enterprise-copy--heading-style-h6">
                      How to trade Bitcoin on Deriv MT5 Live Demo
                    </h3>
                    <p fs-cmsfilter-field="">
                      Discover the secrets to successful Bitcoin trading with Vince Stanzione—a veteran trader and New York Times bestselling author
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="academy-guide_list-wrap hide w-dyn-list">
            <div className="w-dyn-empty">
              <div>No items found.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

