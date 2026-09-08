import * as Dialog from "@radix-ui/react-dialog";
import * as Accordion from "@radix-ui/react-accordion";
import { CaretDownIcon, ListIcon, XIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

type NavigationLink = {
  href: string;
  label: string;
};

type NavigationGroup = {
  label: string;
  links: NavigationLink[];
};

type AetherHeaderNavigationProps = {
  bookingHref: string;
  bookingLabel: string;
  groups: NavigationGroup[];
  languageLabel: string;
  languageHref: string;
  languageMenuLabel: string;
  mentoringHref: string;
  mentoringLabel: string;
  navigationLabel: string;
  bookingExternalHref: string;
  selfieBookingExternalHref: string;
  homeHref: string;
};

export default function AetherHeaderNavigation({
  bookingHref,
  bookingLabel,
  groups,
  languageLabel,
  languageHref,
  languageMenuLabel,
  mentoringHref,
  mentoringLabel,
  navigationLabel,
  bookingExternalHref,
  selfieBookingExternalHref,
  homeHref
}: AetherHeaderNavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    const closeMenus = (event: MouseEvent) => {
      if (!(event.target instanceof Element) || !event.target.closest(".header-interactive")) {
        setOpenMenu(null);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenMenu(null);
    };

    document.addEventListener("click", closeMenus);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("click", closeMenus);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  // The Wix mobile menu keeps a different resident-artist order, while the
  // studio menu shares the same duplicate-destination section links as desktop.
  const mobileGroups = groups.map((group, index) => {
    if (index === 1) {
      return {
        ...group,
        links: [group.links[0], group.links[3], group.links[2], group.links[1]]
      };
    }
    return group;
  });

  return (
    <div className="header-interactive">
      <nav className="main-nav" aria-label={navigationLabel}>
        <ul className="main-nav__list">
          {groups.map((group, index) => (
            <li className={`nav-menu nav-menu--${index + 1}`} key={group.label}>
              <button
                className="nav-trigger"
                type="button"
                aria-expanded={openMenu === group.label}
                aria-controls={`nav-panel-${index + 1}`}
                onClick={() => setOpenMenu(openMenu === group.label ? null : group.label)}
              >
                <span>{group.label}</span>
                <CaretDownIcon className="nav-trigger__icon" size={14} weight="regular" aria-hidden="true" />
              </button>
              <div className="nav-dropdown" id={`nav-panel-${index + 1}`} hidden={openMenu !== group.label}>
                  <ul>
                  {group.links.map((link, linkIndex) => (
                    <li key={`${link.href}-${linkIndex}`}>
                      <a href={link.href} onClick={() => setOpenMenu(null)}>{link.label}</a>
                    </li>
                  ))}
                  </ul>
              </div>
            </li>
          ))}
          <li><a className="nav-direct" href={mentoringHref}>{mentoringLabel}</a></li>
        </ul>
      </nav>

      <div className="header-actions">
        <a className="button button--dark header-book" data-gtag-event="booking_click" data-gtag-location="header" href={bookingHref}>{bookingLabel}</a>
        <div className="language-menu" aria-label={languageMenuLabel}>
          <button
            className="language-switch"
            type="button"
            aria-expanded={openMenu === "language"}
            aria-controls="language-options"
            onClick={() => setOpenMenu(openMenu === "language" ? null : "language")}
          >
            <span>{languageLabel}</span><span className="language-chevron" aria-hidden="true" />
          </button>
          <div className="language-options" id="language-options" hidden={openMenu !== "language"}>
            <a href={languageHref} onClick={() => setOpenMenu(null)}>{languageLabel === "HU" ? "EN" : "HU"}</a>
          </div>
        </div>
        <Dialog.Root open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <Dialog.Trigger asChild>
            <button className="mobile-nav-trigger" type="button" aria-label={mobileMenuOpen ? (languageLabel === "HU" ? "Menü bezárása" : "Close menu") : navigationLabel}>
              <ListIcon size={22} weight="regular" aria-hidden="true" />
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="mobile-nav-overlay" />
            <Dialog.Content className="mobile-nav-panel">
              <Dialog.Title className="mobile-nav-panel__title">{navigationLabel}</Dialog.Title>
              <Dialog.Close asChild>
                <button className="mobile-nav-close" type="button" aria-label={languageLabel === "HU" ? "Menü bezárása" : "Close menu"}>
                  <XIcon size={26} weight="regular" aria-hidden="true" />
                </button>
              </Dialog.Close>
              <Dialog.Description className="mobile-nav-description">
                {languageLabel === "HU" ? "A webhely fő oldalai" : "Main pages of the website"}
              </Dialog.Description>
              <nav className="mobile-nav-links" aria-label={navigationLabel}>
                <a className="mobile-nav-link mobile-nav-link--home" href={homeHref}>{languageLabel === "HU" ? "kezdőlap" : "home"}</a>
                <Accordion.Root className="mobile-nav-accordions" type="multiple">
                  {mobileGroups.map((group) => (
                    <Accordion.Item className="mobile-nav-accordion" value={group.label} key={group.label}>
                      <Accordion.Header className="mobile-nav-accordion__header">
                        <Accordion.Trigger className="mobile-nav-accordion__trigger">
                          <span>{group.label}</span>
                          <CaretDownIcon className="mobile-nav-accordion__icon" size={14} weight="regular" aria-hidden="true" />
                        </Accordion.Trigger>
                      </Accordion.Header>
                      <Accordion.Content className="mobile-nav-accordion__content">
                        {group.links.map((link, linkIndex) => (
                          <a href={link.href} key={`${link.href}-${linkIndex}`}>{link.label}</a>
                        ))}
                      </Accordion.Content>
                    </Accordion.Item>
                  ))}
                </Accordion.Root>
                <a className="mobile-nav-link mobile-nav-link--strong" href={mentoringHref}>{mentoringLabel}</a>
                <a className="mobile-nav-link mobile-nav-link--strong" href={bookingHref}>{languageLabel === "HU" ? "ÁRAK" : "PRICING"}</a>
                <a className="mobile-nav-book" data-gtag-event="booking_click" data-gtag-location="mobile-navigation" href={bookingExternalHref}>{languageLabel === "HU" ? "fotóstúdió foglalása" : "book the photostudio"}</a>
                <a className="mobile-nav-book" data-gtag-event="selfie_booking_click" data-gtag-location="mobile-navigation" href={selfieBookingExternalHref}>{languageLabel === "HU" ? "szelfi stúdió foglalása" : "book the selfie studio"}</a>
                <button
                  className="mobile-nav-book mobile-nav-book--secondary"
                  data-gtag-event="email_click"
                  data-gtag-location="mobile-navigation"
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    window.setTimeout(() => document.querySelector<HTMLDialogElement>("[data-site-contact-modal]")?.showModal(), 0);
                  }}
                >
                  {languageLabel === "HU" ? "írj nekünk" : "message us"}
                </button>
              </nav>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  );
}
