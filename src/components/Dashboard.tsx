import React, { useState } from "react";
import { Button } from "./ui/Button";

interface FormData {
  title: string;
  description: string;
  point: number | "";
}

interface Form {
  createProposal: (title: string, description: string, point: number) => void;
}

const DarkRetroDashboard: React.FC<Form> = ({ createProposal }) => {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    point: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? parseInt(value) : value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (typeof formData.point === "number") {
      createProposal(formData.title, formData.description, formData.point);
    } else {
      console.error("Point must be a number");
    }
  };

  return (
    <section className="w-full py-12 bg-[#121212] text-gray-100">
      {/* Banner Section */}
      <div className="relative w-full h-72 overflow-hidden rounded-lg shadow-lg">
        <img src="/meta.png" alt="DAO Voting Banner" className="object-cover w-full h-full" />
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <h1 className="text-5xl font-mono tracking-wide font-bold text-neon-pink">DAO Voting Platform</h1>
          <p className="text-xl mt-2 text-neon-cyan">Participate in the decision-making process of the DAO. Create and vote on proposals.</p>
        </div>
      </div>

      {/* Proposal Form Section */}
      <div className="container max-w-4xl mx-auto mt-12 px-4">
        <div className="p-8 bg-gray-800 rounded-lg shadow-lg border border-gray-600">
          <h2 className="text-3xl font-semibold text-neon-pink text-center mb-6">Create a New Proposal</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Title Input */}
              <div className="flex flex-col">
                <label className="text-gray-300 font-medium mb-2">Title *</label>
                <input
                  type="text"
                  placeholder="Title for your proposal"
                  className="p-3 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-neon-pink"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              {/* Points Input */}
              <div className="flex flex-col">
                <label className="text-gray-300 font-medium mb-2">Points *</label>
                <input
                  type="number"
                  placeholder="e.g., 10"
                  className="p-3 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-neon-green"
                  name="point"
                  value={formData.point}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Description Input */}
            <div className="flex flex-col">
              <label className="text-gray-300 font-medium mb-2">Description *</label>
              <textarea
                className="p-3 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-neon-blue"
                placeholder="Explain your proposal"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button type="submit" className="px-6 py-3 text-white bg-neon-pink rounded-lg hover:bg-neon-pink-dark transition">
                Create Proposal
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default DarkRetroDashboard;



// import React, { useState } from "react";
// import { Button } from "./ui/Button";

// interface FormData {
//   title: string;
//   description: string;
//   point: number | "";
// }

// interface Form {
//   createProposal: (title: string, description: string, point: number) => void;
// }

// const Dashboard: React.FC<Form> = ({ createProposal }) => {
//   const [formData, setFormData] = useState<FormData>({
//     title: "",
//     description: "",
//     point: "",
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value, type } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "number" ? parseInt(value) : value,
//     });
//   };

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (typeof formData.point === "number") {
//       createProposal(formData.title, formData.description, formData.point);
//     } else {
//       console.error("Point must be a number");
//     }
//   };

//   return (
//     <section className="w-full py-12 bg-gradient-to-r from-teal-400 via-green-400 to-yellow-400 text-gray-800">
//       {/* Banner Section */}
//       <div className="relative w-full h-72 overflow-hidden rounded-lg shadow-lg">
//         <img src="/meta.png" alt="DAO Voting Banner" className="object-cover w-full h-full" />
//         <div className="absolute inset-0 bg-black opacity-30"></div>
//         <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
//           <h1 className="text-5xl font-bold text-white mb-2">DAO Voting Platform</h1>
//           <p className="text-xl text-white">Participate in the decision-making process of the DAO. Create and vote on proposals.</p>
//         </div>
//       </div>

//       {/* Proposal Form Section */}
//       <div className="container max-w-4xl mx-auto mt-12 px-4">
//         <div className="p-8 bg-white rounded-lg shadow-lg border border-gray-300">
//           <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">Create a New Proposal</h2>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//               {/* Title Input */}
//               <div className="flex flex-col">
//                 <label className="text-gray-700 font-medium mb-2">Title *</label>
//                 <input
//                   type="text"
//                   placeholder="Title for your proposal"
//                   className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
//                   name="title"
//                   value={formData.title}
//                   onChange={handleChange}
//                 />
//               </div>

//               {/* Points Input */}
//               <div className="flex flex-col">
//                 <label className="text-gray-700 font-medium mb-2">Points *</label>
//                 <input
//                   type="number"
//                   placeholder="e.g., 10"
//                   className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
//                   name="point"
//                   value={formData.point}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>

//             {/* Description Input */}
//             <div className="flex flex-col">
//               <label className="text-gray-700 font-medium mb-2">Description *</label>
//               <textarea
//                 className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
//                 placeholder="Explain your proposal"
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 rows={4}
//               />
//             </div>

//             {/* Submit Button */}
//             <div className="flex justify-center">
//               <Button type="submit" className="px-6 py-3 text-white bg-teal-500 rounded-lg hover:bg-teal-600 transition">
//                 Create Proposal
//               </Button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Dashboard;
