import * as Dialog from "@radix-ui/react-dialog";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import "./radix-probe.css";

const studioLinks = [
  ["/studio", "Studio"],
  ["/selfie-studio-budapest", "Selfie studio"],
  ["/equipment", "Lights & equipment"],
  ["/props", "Furniture & props"]
];

const artistLinks = [
  ["/photographers-budapest", "Photographers"],
  ["/models-budapest", "Models"],
  ["/stylists", "Stylists & brand designers"],
  ["/make-up-artists", "Make-up artists & hair stylists"]
];

const LinkGroup = ({ links }: { links: string[][] }) => (
  <ul className="radix-nav__links">
    {links.map(([href, label]) => (
      <li key={href}>
        <NavigationMenu.Link asChild>
          <a href={href}>{label}</a>
        </NavigationMenu.Link>
      </li>
    ))}
  </ul>
);

export default function RadixProbe() {
  return (
    <section className="radix-probe" aria-labelledby="radix-probe-title">
      <p className="radix-probe__eyebrow">Headless interaction test</p>
      <h2 id="radix-probe-title">Radix behavior with Aether styling</h2>
      <p className="radix-probe__intro">
        This section tests the library most relevant to the production header and complex overlays.
      </p>

      <NavigationMenu.Root className="radix-nav">
        <NavigationMenu.List className="radix-nav__list">
          <NavigationMenu.Item>
            <NavigationMenu.Trigger className="radix-nav__trigger">
              The studio <span aria-hidden="true">⌄</span>
            </NavigationMenu.Trigger>
            <NavigationMenu.Content className="radix-nav__content" forceMount>
              <LinkGroup links={studioLinks} />
            </NavigationMenu.Content>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <NavigationMenu.Trigger className="radix-nav__trigger">
              Resident artists <span aria-hidden="true">⌄</span>
            </NavigationMenu.Trigger>
            <NavigationMenu.Content className="radix-nav__content" forceMount>
              <LinkGroup links={artistLinks} />
            </NavigationMenu.Content>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <NavigationMenu.Link asChild>
              <a className="radix-nav__link" href="/photographer-mentoring-budapest">Mentoring</a>
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
        <div className="radix-nav__viewport-position">
          <NavigationMenu.Viewport className="radix-nav__viewport" />
        </div>
      </NavigationMenu.Root>

      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button className="radix-probe__button" type="button">Open dialog</button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="radix-dialog__overlay" />
          <Dialog.Content className="radix-dialog__content">
            <Dialog.Title className="radix-dialog__title">Booking interaction test</Dialog.Title>
            <Dialog.Description className="radix-dialog__description">
              Radix supplies the focus trap, Escape handling, outside-click behavior, and accessible labelling.
            </Dialog.Description>
            <Dialog.Close asChild>
              <button className="radix-probe__button" type="button">Close</button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}
