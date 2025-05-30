import React from "react";

function AboutUsSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-6">
              About <span className="text-blue-600">Us</span>
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-8">
              Centurion University of Technology and Management (CUTM) is a pioneering institution recognized for its commitment to skill-integrated, outcome-based education. As an awarding body, CUTM empowers learners with nationally and globally relevant qualifications, blending academic excellence with hands-on industry training. Accredited and acclaimed for its innovation-driven model, the university serves as a catalyst for sustainable development and inclusive growth, shaping job-ready professionals and entrepreneurs across diverse sectors.
            </p>
            <a
              href="/about"
              className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
            >
              Learn More About Us
            </a>
          </div>
          <div className="md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1531973576160-7125cd663d86"
              alt="About Us"
              className="w-full h-auto object-cover rounded-lg shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutUsSection;
