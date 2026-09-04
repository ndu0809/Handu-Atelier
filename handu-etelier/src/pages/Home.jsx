import Navbar from "../components/layout/Navbar";
import Hero from "../components/home/Hero";
import Features from "../components/home/Features";
import Categories from "../components/home/Categories";
import FeaturedCostumes from "../components/home/FeaturedCostumes";
import HowToRent from "../components/home/HowToRent";
import Testimonials from "../components/home/Testimonials";
import About from "../components/home/About";
import Footer from "../components/layout/Footer";

function Home() {
    return (
        <div
            className="
                relative
                overflow-hidden
                min-h-screen
                bg-[#090909]
                text-white
            "
        >

            {/* Glow kiri atas */}
            <div
                className="
                    absolute
                    -top-52
                    -left-40
                    w-[600px]
                    h-[600px]
                    rounded-full
                    bg-[#D4AF37]/15
                    blur-[150px]
                "
            ></div>

            {/* Glow kanan */}
            <div
                className="
                    absolute
                    top-40
                    right-0
                    w-[450px]
                    h-[450px]
                    rounded-full
                    bg-[#8A6A16]/20
                    blur-[150px]
                "
            ></div>

            <Navbar />

            <Hero />

            <About />

            <Features />

            {/* TETAP ADA DI HALAMAN UTAMA */}
            <HowToRent />

            <FeaturedCostumes />

            <Categories />

            <Testimonials />

            <Footer />

        </div>
    );
}

export default Home;