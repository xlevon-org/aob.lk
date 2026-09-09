import React from 'react';
import { useApp } from '../../context/AppContext';

export const HomeMessengers: React.FC = () => {
  const { setDemoAccountModalOpen, showToast } = useApp();

  const handleLiveChat = (e: React.MouseEvent) => {
    e.preventDefault();
    showToast('Connecting to 24/7 Live Support...', 'info');
  };

  const handleOpenAccount = (e: React.MouseEvent) => {
    e.preventDefault();
    setDemoAccountModalOpen(true);
  };

  return (
    <>
      <div data-wf--bottom-cta--variant="base" className="bottom-cta_component"><div className="bottom-cta_wrapper"><div data-dwp-user-type="authenticated" data-wf--design-system-enterprise-copy--authenticated-block--variant="base" className="design-system-enterprise-copy--auth_component"><div className="design-system-enterprise-copy--auth_button_wrapper"><a data-wf--design-system-enterprise-copy--button--variant="coral-solid" href="https://home.deriv.com/dashboard" className="design-system-enterprise-copy--button w-inline-block"><div data-traking="button-text" className="design-system-enterprise-copy--button_text">Trade now</div></a></div></div><div data-dwp-user-type="unauthenticated" data-wf--design-system-enterprise-copy--unauthenticated-block--variant="base" className="design-system-enterprise-copy--auth_component"><div className="design-system-enterprise-copy--auth_wrapper"><div className="design-system-enterprise-copy--auth_button_wrapper"><a data-wf--design-system-enterprise-copy--button--variant="coral-solid" href="https://home.deriv.com/dashboard/signup" className="design-system-enterprise-copy--button w-inline-block"><div data-traking="button-text" className="design-system-enterprise-copy--button_text">Open account</div></a></div></div></div></div></div><div data-w-id="0ee95f6d-2fe4-a2a7-0e56-88db644db838" className="messengers_component"><a id="whatsapp-wrapper" href="https://api.whatsapp.com/send/?phone=94777859947&amp;text=Hello%20Academy%20of%20Binary%20(AOB)%2C%20I%20am%20interested%20in%20your%20trading%20courses%20and%20Deriv%20bot&amp;type=phone_number&amp;app_absent=0" target="_blank" title="Chat with Academy of Binary on WhatsApp (077 785 9947)" className="messengers_button w-inline-block"><img src="https://cdn.prod.website-files.com/67c187cdf63c319864a8482d/68469407556ed21f1cb0bb8b_0efbadb0f7dba36b399a975b42ee71cf_whatsapp-sm.svg" loading="eager" fetchPriority="high" alt="WhatsApp Academy of Binary" className="messengers_icon"/></a><a id="live_chat-wrapper" data-dwp-button="livechat" href="#" onClick={handleLiveChat} className="messengers_button w-inline-block"><img loading="lazy" src="https://cdn.prod.website-files.com/67c187cdf63c319864a8482d/68469407556ed21f1cb0bb8c_1c47ed759d2ecf5daf165be7d045e79e_message-lines-md.svg" alt="Live chat" className="messengers_icon"/></a><div className="messengers_cta-button-gap"></div></div>
    </>
  );
};
