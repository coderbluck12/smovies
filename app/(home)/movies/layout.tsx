import MovieDetailsSideBar from "@/components/Layout/Movies/Sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <MovieDetailsSideBar />
      <main className="min-h-screen lg:ml-[280px] pt-20 lg:pt-5 p-5">
        {children}
      </main>
    </>
  );
};

export default Layout;