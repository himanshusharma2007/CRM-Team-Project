import nitesh from "../../assets/images/nitesh.jpeg";
import dhairya from "../../assets/images/Dhairya.png";
import ujjwal from "../../assets/images/ujjwal.jpeg";
import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-6 md:p-12">
      {/* Container */}
      <div className="max-w-7xl mx-auto">
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            About Us
          </h1>
          <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">
            Our CRM platform is designed to help businesses build stronger
            customer relationships. We focus on simplicity, efficiency, and
            powerful insights to drive growth for our clients.
          </p>
        </section>

        {/* Our Story Section */}
        <section className="md:flex items-center justify-between mb-16">
          <div className="flex-1 md:pr-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Story</h2>
            <p className="text-gray-600 text-lg">
              Established in 2024, we started with the vision of creating an
              easy-to-use CRM system for small and medium-sized businesses. Over
              the years, we have grown into a trusted partner for companies
              looking to optimize customer interactions, streamline processes,
              and make data-driven decisions.
            </p>
          </div>
          <div className="flex-1 mt-8 md:mt-0">
            <img
              src="https://images.pexels.com/photos/17382268/pexels-photo-17382268/free-photo-of-men-working-in-office.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="Company History"
              className="rounded-lg shadow-lg w-full h-auto"
            />
          </div>
        </section>

        {/* Meet the Team Section */}
        <section className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Meet the Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <img
                src={dhairya}
                alt="Team Member 1"
                className="rounded-full w-32 h-32 mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800">
                Dhairya Jain
              </h3>
              <p className="text-gray-600">Developer</p>
            </div>

            {/* Team Member 2 */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <img
                src={nitesh}
                alt="Team Member 2"
                className="rounded-full w-32 h-32 mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800">
                Nitesh Kumawat
              </h3>
              <p className="text-gray-600">Developer</p>
            </div>

            {/* Team Member 3 */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <img
                src={ujjwal}
                alt="Team Member 3"
                className="rounded-full w-32 h-32 mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800">
                Ujjwal Kumar
              </h3>
              <p className="text-gray-600">Developer</p>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="text-center py-12 bg-green-500 text-white rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-4">Join Us on Our Journey</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Whether you are a small business looking to organize customer
            relationships or an enterprise aiming to optimize sales pipelines,
            we are here to help you succeed.
          </p>
          <Link
            to="/contactus"
            className="bg-white text-green-500 font-semibold py-3 px-6 rounded-lg shadow hover:bg-gray-100 transition duration-200"
          >
            Contact Us
          </Link>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
