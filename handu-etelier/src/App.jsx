import {
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

// ======================================================
// PUBLIC
// ======================================================

import Home from "./pages/Home";
import CategoryPage from "./pages/category/CategoryPage";
import CostumeDetail from "./pages/costume/CostumeDetail";
import BorrowForm from "./pages/borrowing/BorrowForm";
import BorrowSuccess from "./pages/borrowing/BorrowSuccess";
import CollectionsPage from "./pages/category/CollectionsPage";

// ======================================================
// HOW TO RENT
// ======================================================

import HowToRent from "./components/home/HowToRent";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// ======================================================
// AUTH
// ======================================================

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// ======================================================
// USER
// ======================================================

import Dashboard from "./pages/dashboard/Dashboard";
import Profile from "./pages/user/Profile";
import Settings from "./pages/user/Settings";
import ChangePassword from "./pages/user/ChangePassword";
import MyBorrowings from "./pages/user/MyBorrowings";
import BorrowingDetail from "./pages/user/BorrowingDetail";

// ======================================================
// CHAT
// ======================================================

import ChatPage from "./pages/chat/chatPage";

// ======================================================
// LAYOUT
// ======================================================

import UserLayout from "./pages/user/UserLayout.jsx";
import StaffLayout from "./components/layout/StaffLayout";

// ======================================================
// ROUTE GUARDS
// ======================================================

// Folder routes berada di luar src
import ProtectedRoute from "../routes/ProtectedRoute";
import GuestRoute from "../routes/GuestRoute";

// ======================================================
// PETUGAS
// ======================================================

import StaffDashboard from "./pages/staff/StaffDashboard.jsx";
import PeminjamanPetugas from "./pages/staff/PeminjamanPetugas.jsx";
import PeminjamanDetailPetugas from "./pages/staff/PeminjamanDetailPetugas.jsx";
import PengembalianPetugas from "./pages/staff/PengembalianPetugas.jsx";
import KostumPetugas from "./pages/staff/KostumPetugas.jsx";
import StaffProfile from "./pages/staff/StaffProfile.jsx";
import Customer from "./pages/staff/Customer.jsx";
import Payments from "./pages/staff/Payments.jsx";
import CustomerDetail from "./pages/staff/CustomerDetail.jsx";
import PengaturanPembayaran from "./pages/staff/PengaturanPembayaran";

// ======================================================
// ADMIN
// ======================================================

import AdminDashboard from "./pages/admin/AdminDashboard";
import KategoriPage from "./pages/admin/KategoriPage";
import KostumPage from "./pages/admin/KostumPage";
import NotificationPage from "./pages/admin/NotificationPage";
import PelangganPage from "./pages/admin/PelangganPage";
import PeminjamanPage from "./pages/admin/PeminjamanPage";
import PengaturanPage from "./pages/admin/PengaturanPage";
import PetugasPage from "./pages/admin/PetugasPage";
import RegistrasiPage from "./pages/admin/RegistrasiPage";
import KoleksiPage from "./pages/admin/KoleksiPage";

// ======================================================
// ADMIN LAYOUT
// ======================================================

import AdminLayout from "./components/admin/AdminLayout";

// ======================================================
// ADMIN ROUTE WRAPPER
// ======================================================

function AdminPage({
  children,
  activePage,
}) {
  const navigate = useNavigate();

  const handleNavigate = (page) => {
    switch (page) {
      case "dashboard":
        navigate("/admin/dashboard");
        break;

      case "petugas":
        navigate("/admin/petugas");
        break;

      case "pelanggan":
        navigate("/admin/pelanggan");
        break;

      case "kostum":
        navigate("/admin/kostum");
        break;

      case "koleksi":
        navigate("/admin/koleksi");
        break;

      case "kategori":
        navigate("/admin/kategori");
        break;

      case "registrasi":
        navigate("/admin/registrasi");
        break;

      case "peminjaman":
        navigate("/admin/peminjaman");
        break;

      case "notifications":
        navigate("/admin/notifikasi");
        break;

      case "pengaturan":
        navigate("/admin/pengaturan");
        break;

      default:
        navigate("/admin/dashboard");
        break;
    }
  };

  return (
    <AdminLayout
      activePage={activePage}
      onNavigate={handleNavigate}
    >
      {children}
    </AdminLayout>
  );
}

// ======================================================
// APP
// ======================================================

function App() {
  return (
    <Routes>

      {/* ==================================================
          PUBLIC
      ================================================== */}

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/category/:slug"
        element={<CategoryPage />}
      />

      <Route
        path="/costume/:code"
        element={<CostumeDetail />}
      />

      <Route
        path="/borrow/:code"
        element={<BorrowForm />}
      />

      <Route
        path="/borrow-success"
        element={<BorrowSuccess />}
      />

      <Route
        path="/collections"
        element={<CollectionsPage />}
      />


      {/* ==================================================
          HOW TO RENT
      ================================================== */}

      <Route
        path="/how-to-rent"
        element={
          <div
            className="
              min-h-screen
              bg-[#090909]
              text-white
            "
          >
            <Navbar />

            <HowToRent />

            <Footer />
          </div>
        }
      />


      {/* ==================================================
          GUEST ONLY
      ================================================== */}

      <Route element={<GuestRoute />}>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

      </Route>


      {/* ==================================================
          LOGIN REQUIRED
      ================================================== */}

      <Route element={<ProtectedRoute />}>

        {/* ==================================================
            USER
        ================================================== */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />

        <Route
          path="/change-password"
          element={<ChangePassword />}
        />

        <Route
          path="/my-borrowings"
          element={<MyBorrowings />}
        />

        <Route
          path="/borrow-detail/:id"
          element={<BorrowingDetail />}
        />


        {/* ==================================================
            USER CHAT
            SIDEBAR USER TETAP ADA
            CHAT TETAP REALTIME
        ================================================== */}

        <Route
          path="/chat"
          element={
            <UserLayout>
              <ChatPage mode="customer" />
            </UserLayout>
          }
        />


        {/* ==================================================
            PETUGAS
        ================================================== */}

        <Route
          path="/petugas/dashboard"
          element={<StaffDashboard />}
        />

        <Route
          path="/petugas/peminjaman"
          element={<PeminjamanPetugas />}
        />

        <Route
          path="/petugas/peminjaman/:id"
          element={
            <PeminjamanDetailPetugas />
          }
        />

        <Route
          path="/petugas/pengembalian"
          element={
            <PengembalianPetugas />
          }
        />

        <Route
          path="/petugas/kostum"
          element={
            <KostumPetugas />
          }
        />

        <Route
          path="/petugas/customer"
          element={<Customer />}
        />

        <Route
          path="/petugas/profile"
          element={
            <StaffProfile />
          }
        />

        <Route
          path="/petugas/pembayaran"
          element={<Payments />}
        />

        <Route
          path="/petugas/customer/:id"
          element={
            <CustomerDetail />
          }
        />

        <Route
          path="/petugas/pengaturan-pembayaran"
          element={
            <PengaturanPembayaran />
          }
        />


        {/* ==================================================
            PETUGAS CHAT
            SIDEBAR PETUGAS TETAP ADA
            CHAT TETAP REALTIME
        ================================================== */}

        <Route
          path="/petugas/chat"
          element={
            <StaffLayout>
              <ChatPage mode="petugas" />
            </StaffLayout>
          }
        />

      </Route>


      {/* ==================================================
          ADMIN LOGIN LAMA
      ================================================== */}

      <Route
        path="/admin/login"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />


      {/* ==================================================
          ADMIN
      ================================================== */}

      <Route
        path="/admin/dashboard"
        element={
          <AdminPage activePage="dashboard">
            <AdminDashboard />
          </AdminPage>
        }
      />

      <Route
        path="/admin/petugas"
        element={
          <AdminPage activePage="petugas">
            <PetugasPage />
          </AdminPage>
        }
      />

      <Route
        path="/admin/pelanggan"
        element={
          <AdminPage activePage="pelanggan">
            <PelangganPage />
          </AdminPage>
        }
      />

      <Route
        path="/admin/kostum"
        element={
          <AdminPage activePage="kostum">
            <KostumPage />
          </AdminPage>
        }
      />

      <Route
        path="/admin/koleksi"
        element={
          <AdminPage activePage="koleksi">
            <KoleksiPage />
          </AdminPage>
        }
      />

      <Route
        path="/admin/kategori"
        element={
          <AdminPage activePage="kategori">
            <KategoriPage />
          </AdminPage>
        }
      />

      <Route
        path="/admin/registrasi"
        element={
          <AdminPage activePage="registrasi">
            <RegistrasiPage />
          </AdminPage>
        }
      />

      <Route
        path="/admin/peminjaman"
        element={
          <AdminPage activePage="peminjaman">
            <PeminjamanPage />
          </AdminPage>
        }
      />

      <Route
        path="/admin/notifikasi"
        element={
          <AdminPage activePage="notifications">
            <NotificationPage />
          </AdminPage>
        }
      />

      <Route
        path="/admin/pengaturan"
        element={
          <AdminPage activePage="pengaturan">
            <PengaturanPage />
          </AdminPage>
        }
      />


      {/* ==================================================
          ADMIN FALLBACK
      ================================================== */}

      <Route
        path="/admin"
        element={
          <Navigate
            to="/admin/dashboard"
            replace
          />
        }
      />


      {/* ==================================================
          GLOBAL FALLBACK
      ================================================== */}

      <Route
        path="*"
        element={<Home />}
      />

    </Routes>
  );
}

export default App;