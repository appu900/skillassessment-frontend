/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import image from "/profile.jpg";

const StudentTable10 = ({ students }) => {
  const rows = Array.from({ length: 10 }).map(
    (_, index) => students[index] || {}
  );

  return (
    <div className="table-container">
      <table className="w-full border-collapse border border-black mb-4">
        <thead>
          <tr>
            <th className="border border-black p-2">SL. NO</th>
            <th className="border border-black p-2">CANDIDATE PHOTO</th>
            <th className="border border-black p-2">
              REGD. NO. CANDIDATE NAME
            </th>
            <th className="border border-black p-2">{`FATHER'S NAME`}</th>
            <th className="border border-black p-2">GENDER</th>
            <th className="border border-black p-2">DATE OF BIRTH</th>
            <th className="border border-black p-2">CANDIDATE SIGNATURE</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((student, index) => (
            <tr key={index}>
              <td className="border border-black text-center p-2">
                {index + 1}
              </td>
              <td className="border border-black px-6 py-2">
                {student.image ? (
                  <img
                    src={student.image}
                    alt="Candidate Photo"
                    className="h-32 w-32"
                  />
                ) : (
                  <div className="w-32 h-32"></div>
                )}
              </td>
              <td className="border border-black p-2 text-center">
                {student.redg_No || ""}
                {student.name ? ` / ${student.name}` : ""}
              </td>
              <td className="border border-black p-2 text-center">
                {student.fathername || ""}
              </td>
              <td className="border border-black p-2 text-center">
                {student.gender || ""}
              </td>
              <td className="border border-black p-2 text-center">
                {student.dob || ""}
              </td>
              <td className="border border-black p-2"></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable10;
