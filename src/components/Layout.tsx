import ScrollToTop from "./ScrollToTop";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <ScrollToTop />
      {children}
    </>
  );
};

export default Layout;
