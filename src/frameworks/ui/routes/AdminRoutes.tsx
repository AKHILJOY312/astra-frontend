import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "@/frameworks/ui/pages/admin/AuthPages/SignIn";
import SignUp from "@/frameworks/ui/pages/admin/AuthPages/SignUp";
import NotFound from "@/frameworks/ui/pages/admin/OtherPage/NotFound";
import UserProfiles from "@/frameworks/ui/pages/admin/UserProfiles";
import Videos from "@/frameworks/ui/pages/admin/UiElements/Videos";
import Images from "@/frameworks/ui/pages/admin/UiElements/Images";
import Alerts from "@/frameworks/ui/pages/admin/UiElements/Alerts";
import Badges from "@/frameworks/ui/pages/admin/UiElements/Badges";
import Avatars from "@/frameworks/ui/pages/admin/UiElements/Avatars";
import Buttons from "@/frameworks/ui/pages/admin/UiElements/Buttons";
import LineChart from "@/frameworks/ui/pages/admin/Charts/LineChart";
import BarChart from "@/frameworks/ui/pages/admin/Charts/BarChart";
import Calendar from "@/frameworks/ui/pages/admin/Calendar";
import BasicTables from "@/frameworks/ui/pages/admin/Tables/BasicTables";
import FormElements from "@/frameworks/ui/pages/admin/Forms/FormElements";
import Blank from "@/frameworks/ui/pages/admin/Blank";
import AppLayout from "@/frameworks/ui/layout/admin/AppLayout";
import { ScrollToTop } from "@/frameworks/ui/components/admin/common/ScrollToTop";
import Home from "@/frameworks/ui/pages/admin/Dashboard/Home";

// export default function Admin() {
//   return (
//     <>
//       <Router>
//         <ScrollToTop />
//         <Routes>
//           {/* Dashboard Layout */}
//           <Route element={<AppLayout />}>
//             <Route index path="/admin" element={<Home />} />

//             {/* Others Page */}
//             <Route path="/admin/profile" element={<UserProfiles />} />
//             <Route path="/admin/calendar" element={<Calendar />} />
//             <Route path="/admin/blank" element={<Blank />} />

//             {/* Forms */}
//             <Route path="/admin/form-elements" element={<FormElements />} />

//             {/* Tables */}
//             <Route path="/admin/basic-tables" element={<BasicTables />} />

//             {/* Ui Elements */}
//             <Route path="/admin/alerts" element={<Alerts />} />
//             <Route path="/admin/avatars" element={<Avatars />} />
//             <Route path="/admin/badge" element={<Badges />} />
//             <Route path="/admin/buttons" element={<Buttons />} />
//             <Route path="/admin/images" element={<Images />} />
//             <Route path="/admin/videos" element={<Videos />} />

//             {/* Charts */}
//             <Route path="/admin/line-chart" element={<LineChart />} />
//             <Route path="/admin/bar-chart" element={<BarChart />} />
//           </Route>

//           {/* Auth Layout */}
//           <Route path="/admin/signin" element={<SignIn />} />
//           <Route path="/admin/signup" element={<SignUp />} />

//           {/* Fallback Route */}
//           <Route path="*" element={<NotFound />} />
//         </Routes>
//       </Router>
//     </>
//   );
// }
export const adminRoutes = (
  <>
    {/* <ScrollToTop /> */}
    <Route element={<AppLayout />}>
      <Route index path="/admin" element={<Home />} />
      <Route path="/admin/profile" element={<UserProfiles />} />
      <Route path="/admin/calendar" element={<Calendar />} />
      <Route path="/admin/blank" element={<Blank />} />
      <Route path="/admin/form-elements" element={<FormElements />} />
      <Route path="/admin/basic-tables" element={<BasicTables />} />
      <Route path="/admin/alerts" element={<Alerts />} />
      <Route path="/admin/avatars" element={<Avatars />} />
      <Route path="/admin/badge" element={<Badges />} />
      <Route path="/admin/buttons" element={<Buttons />} />
      <Route path="/admin/images" element={<Images />} />
      <Route path="/admin/videos" element={<Videos />} />
      <Route path="/admin/line-chart" element={<LineChart />} />
      <Route path="/admin/bar-chart" element={<BarChart />} />
    </Route>

    <Route path="/admin/signin" element={<SignIn />} />
    <Route path="/admin/signup" element={<SignUp />} />
  </>
);
