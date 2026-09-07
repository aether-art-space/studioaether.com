import * as Dialog from "@radix-ui/react-dialog";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import * as Accordion from "@radix-ui/react-accordion";
import { CaretDownIcon, ListIcon, XIcon } from "@phosphor-icons/react";
import { useState } from "react";

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
  bookingExternalHref
}: AetherHeaderNavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      <NavigationMenu.Root className="main-nav" aria-label={navigationLabel} delayDuration={0} skipDelayDuration={0}>
        <NavigationMenu.List className="main-nav__list">
          {groups.map((group, index) => (
            <NavigationMenu.Item className={`nav-menu nav-menu--${index + 1}`} key={group.label}>
              <NavigationMenu.Trigger className="nav-trigger">
                {group.label}
              </NavigationMenu.Trigger>
              <NavigationMenu.Content className="nav-dropdown" forceMount>
                <ul>
                  {group.links.map((link, linkIndex) => (
                    <li key={`${link.href}-${linkIndex}`}>
                      <a
                        href={link.href}
                        onPointerDown={(event) => {
                          if (event.button !== 0) return;
                          event.preventDefault();
                          window.location.assign(link.href);
                        }}
                        onClick={(event) => {
                          event.preventDefault();
                          window.location.assign(link.href);
                        }}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
          ))}
          <NavigationMenu.Item>
            <NavigationMenu.Link asChild>
              <a className="nav-direct" href={mentoringHref}>{mentoringLabel}</a>
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>

      <nav className="header-actions" aria-label={languageMenuLabel}>
        <a className="button button--secondary header-book" data-gtag-event="booking_click" data-gtag-location="header" href={bookingHref}>{bookingLabel}</a>
        <details className="language-menu">
          <summary className="language-switch" aria-label={languageMenuLabel}>
            <span>{languageLabel}</span><span className="language-chevron" aria-hidden="true" />
          </summary>
          <div className="language-options">
            <a href={languageHref}>{languageLabel === "HU" ? "EN" : "HU"}</a>
          </div>
        </details>
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
                <a className="mobile-nav-link mobile-nav-link--home" href={languageLabel === "HU" ? "/hu" : "/"}>{languageLabel === "HU" ? "kezdőlap" : "home"}</a>
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
                <a className="mobile-nav-book" data-gtag-event="booking_click" data-gtag-location="mobile-navigation" href={bookingExternalHref}>{languageLabel === "HU" ? "foglalás" : "Book Now"}</a>
              </nav>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </nav>
    </div>
  );
}
