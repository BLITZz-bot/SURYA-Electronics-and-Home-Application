import SiteHeader from "../../components/site-header";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <div className="flex-1">
        {children}
      </div>
    </>
  );
}
