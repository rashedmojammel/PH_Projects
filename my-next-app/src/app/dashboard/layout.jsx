import Link from "next/link";


const DashboardLayout = ({children}) => {
    return (
        <div class="drawer lg:drawer-open">
  <input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content flex flex-col items-center justify-center">
    {children}
    <label for="my-drawer-3" class="btn drawer-button lg:hidden">
      Open drawer
    </label>
  </div>
  <div class="drawer-side">
    <label for="my-drawer-3" aria-label="close sidebar" class="drawer-overlay"></label>
    <ul class="menu bg-base-200 min-h-full w-80 p-4">
     
      <li><Link href="/dashboard">Dashboard</Link></li>
      <li><Link href="/dashboard/revenue">Revenue</Link></li>
      <li><Link href="/dashboard/profile">Profile</Link></li>
    </ul>
  </div>
</div>
    );
};

export default DashboardLayout;