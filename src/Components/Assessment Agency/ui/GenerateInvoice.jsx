/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRecoilState } from "recoil";
import { assessmentAgencyIdState } from "../Atoms/AssessmentAgencyAtoms";
import { server } from "@/main";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components(shadcn)/ui/card";
import { Separator } from "@/components(shadcn)/ui/separator";
import { Pen } from "lucide-react";

const GenerateInvoice = () => {
  const pdfRef = useRef();
  const assessmentAgencyId = useRecoilState(assessmentAgencyIdState);
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [address1, setAddress1] = useState("");
  const [contact, setContact] = useState("");
  const [pan, setPan] = useState("");
  const [gst, setGst] = useState("");
  const [bankName, setBankName] = useState("");
  const [branchName, setBranchName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [totalNoOfcandidates, setTotalNoOfcandidates] = useState(0);
  const [totalNoOfAssessedCandidates, setTotalNoOfAssessedCandidates] =
    useState(0);
  const [totalAmountToBePaid, setTotalAmountToBePaid] = useState(0);
  const [examData, setExamData] = useState([]);
  const [ammountInWord, setAmmountInWord] = useState("");

  useEffect(() => {
    const fetchBatchDetails = async () => {
      try {
        const response = await axios.post(
          `${server}/invoice/${assessmentAgencyId[0]}`
        );
        console.log(response.data.data);
        const data = response.data.data;
        setDate(data.invoiceGenerateDate);
        setName(data.AssesmentAgencyDetails.name);
        setAddress1(data.AssesmentAgencyDetails.address);
        setContact(data.AssesmentAgencyDetails.contactNumber);
        setPan(data.AssesmentAgencyDetails.PAN);
        setGst(data.AssesmentAgencyDetails.GST_Number);
        setBankName(data.BankInformation?.bankName);
        setBranchName(data.BankInformation?.branchName);
        setAccountNumber(data.BankInformation?.accountNumber);
        setIfscCode(data.BankInformation?.IFSCCode);
        setExamData(data.examDetails);
        setTotalNoOfcandidates(data.totalNoOfcandidates);
        setTotalNoOfAssessedCandidates(data.totalNoOfAssessedCandidates);
        setTotalAmountToBePaid(data.totalAmountToBePaid);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    fetchBatchDetails();
    setAmmountInWord(numberToWords(totalAmountToBePaid)); //here i have to add the dynamic data
  }, [totalAmountToBePaid]);

  function numberToWords(num) {
    if (num === 0) return "zero rupees";

    const units = [
      "",
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
      "ten",
      "eleven",
      "twelve",
      "thirteen",
      "fourteen",
      "fifteen",
      "sixteen",
      "seventeen",
      "eighteen",
      "nineteen",
    ];

    const tens = [
      "",
      "",
      "twenty",
      "thirty",
      "forty",
      "fifty",
      "sixty",
      "seventy",
      "eighty",
      "ninety",
    ];

    const scales = ["", "thousand", "lakh", "crore"]; // Indian number scales

    function convertHundred(num) {
      let str = "";

      if (num > 99) {
        str += units[Math.floor(num / 100)] + " hundred ";
        num %= 100;
      }

      if (num > 0) {
        if (num < 20) {
          str += units[num] + " ";
        } else {
          str += tens[Math.floor(num / 10)] + " ";
          if (num % 10 > 0) {
            str += units[num % 10] + " ";
          }
        }
      }
      return str.trim();
    }

    function convertNumberToWords(num) {
      let result = "";
      let scaleIndex = 0;

      while (num > 0) {
        const chunk = num % 1000; // Process in chunks of thousands
        if (chunk > 0) {
          result =
            convertHundred(chunk) + " " + scales[scaleIndex] + " " + result;
        }
        num = Math.floor(num / 1000);
        scaleIndex++;
      }

      return result.trim();
    }

    // Split integer and fractional parts
    const [integerPart, fractionalPart] = num.toString().split(".");

    let rupees = parseInt(integerPart, 10);
    let paise = fractionalPart ? parseInt(fractionalPart.slice(0, 2), 10) : 0; // Consider only two decimal places for paise

    let result = convertNumberToWords(rupees) + " rupees";

    if (paise > 0) {
      result += " and " + convertNumberToWords(paise) + " paise";
    }

    return result.trim();
  }

  const generatePDF = () => {
    const input = document.getElementById("pdf-content");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4", true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;
      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );
      pdf.save("invoice.pdf");
    });
  };

  return (
    <div>
      <div className="p-10" id="pdf-content">
        <h1 className="text-center text-lg font-bold mb-4">
          Monthly assessment fee claim invoice for Assessment Agency
        </h1>
        <div className="border border-black mb-4">
          <div className="grid grid-cols-2 border border-black">
            <div className="border border-black p-2">
              Invoice No: AA/2024-25/04/00001
            </div>
            <div className="border border-black p-2">
              Date : <span className="ml-2 text-md">{date}</span>
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div>
              <p className="border border-black p-2">To</p>
              <p className="border border-black p-2">
                CENTURION UNIVERSITY OF TECHNOLOGY AND MANAGEMENT
              </p>
              <p className="border border-black p-2">
                Center for Skill Certification
              </p>
              <p className="border border-black p-2">Ramachandarpur, Jatni</p>
              <p className="border border-black p-2">
                Pin: 752050, Dist. –Khorda, Odisha
              </p>
              <p className="border border-black p-2">PAN: AAAJC0752B</p>
              <p className="border border-black p-2">GST No: 21AAAJC0752B1Z8</p>
            </div>
            <div>
              <p className="border border-black p-2">From</p>
              <p className="border border-black p-2">
                Name : <span className="ml-2 text-md">{name}</span>
              </p>
              <p className="border border-black p-2">
                Address1- : <span className="ml-2 text-md">{address1}</span>
              </p>
              <p className="border border-black p-2">
                Address2- : <span className="ml-2 text-md">{address1}</span>
              </p>
              <p className="border border-black p-2">
                Contact no- : <span className="ml-2 text-md">{contact}</span>
              </p>
              <p className="border border-black p-2">
                PAN : <span className="ml-2 text-md">{pan}</span>
              </p>
              <p className="border border-black p-2">
                GST No : <span className="ml-2 text-md">{gst}</span>
              </p>
            </div>
          </div>
          <p className="p-2 border border-black">
            Dear Sir, Kindly arrange to pay the amount towards assessment fee
            with the below mentioned bank details.
          </p>
          <div className="p-2 border border-black">
            <p>
              Assessment Agency Bank Name and Branch - <span>{bankName}</span>,{" "}
              <span>{branchName}</span>
            </p>
            <p>
              Account No - <span>{accountNumber}</span>
            </p>
            <p>
              IFSC code - <span>{ifscCode}</span>
            </p>
          </div>
        </div>
        <div className="border-2 border-black p-4 mb-4">
          <h2 className="text-center font-bold mb-4">
            Claim Details for Assessment
          </h2>
          <table className="w-full border-collapse border">
            <thead>
              <tr>
                <th className="border border-black p-2">Sl. No</th>
                <th className="border border-black p-2">ABN No</th>
                <th className="border border-black p-2">TP Name</th>
                <th className="border border-black p-2">Date of Assessment</th>
                <th className="border border-black p-2">
                  Total no of Candidate
                </th>
                <th className="border border-black p-2">
                  No of Assessed candidate
                </th>
                <th className="border border-black p-2">
                  Assessment cost (per Unit)
                </th>
                <th className="border border-black p-2">Amount claim @ </th>
              </tr>
            </thead>
            <tbody className="text-center">
              {examData.map((item, index) => (
                <tr key={item.id}>
                  <td className="border border-black p-2">1</td>
                  <td className="border border-black p-2">{item.batchAbn}</td>
                  <td className="border border-black p-2">{item.tpname}</td>
                  <td className="border border-black p-2">
                    {item?.assesmentDate
                      ? (() => {
                          const dateStr = item?.assesmentDate;
                          const months = {
                            January: "01",
                            February: "02",
                            March: "03",
                            April: "04",
                            May: "05",
                            June: "06",
                            July: "07",
                            August: "08",
                            September: "09",
                            October: "10",
                            November: "11",
                            December: "12",
                          };

                          const [day, month, year] = dateStr.split("-");

                          const monthNumber = months[month];

                          if (monthNumber) {
                            return `${day}-${monthNumber}-${year}`;
                          } else {
                            return "Invalid date";
                          }
                        })()
                      : "No Date Available"}
                  </td>
                  <td className="border border-black p-2 text-center">
                    {item.totalNoOfCandidates}
                  </td>
                  <td className="border border-black p-2 text-center">
                    {item.noOfAssessedCandidates}
                  </td>
                  <td className="border border-black p-2 text-center">
                    {item.costPerCandidate}
                  </td>
                  <td className="border border-black p-2 text-center">
                    {item.amountToPaid}
                  </td>
                </tr>
              ))}

              <tr>
                <td className="text-xs py-2 " colSpan={3}>
                  <div className="flex flex-col">
                    Amount in words :{" "}
                    <span className="text-lg font-semibold">
                      {ammountInWord}
                    </span>
                  </div>
                </td>
                <td className="border border-black p-2">Total</td>
                <td className="border border-black p-2">
                  {totalNoOfcandidates}
                </td>
                <td className="border border-black p-2">
                  {totalNoOfAssessedCandidates}
                </td>
                <td className="border border-black p-2"></td>
                <td className="border border-black p-2">
                  {totalAmountToBePaid}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="mt-4">
            <p className="font-bold">Declaration:</p>
            <ol className="list-decimal list-inside">
              <li>
                I do hear by declare that whenever Awarding Body would demand
                for physical documents for the above mentioned batches would be
                furnished by the assessment agency. All the physical assessment
                records would be stored by assessment agency.
              </li>
              <li>
                The above information furnished by me is true to my knowledge &
                the documents attached are in order. If any deviation in that
                above found at later stage during audit, Assessment Agency will
                be held responsible.
              </li>
            </ol>
          </div>
          <div className="mt-28">
            <p className="font-bold">
              Authorized Signatory of Assessment Agency
            </p>
          </div>
        </div>
        <div className="border-2 border-black p-4">
          <Card className="w-full max-w-full mx-auto">
            <CardHeader className="pb-2">
              <CardTitle className="text-center text-lg font-semibold text-primary">
                Official Use
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-6">
                <SignatureField label="Operation Manager" />
                <SignatureField label="Accountant" />
              </div>
              <div className="grid grid-cols-3 gap-6">
                <SignatureField label="Head of Skill Certification" />
                <SignatureField label="Finance Controller" />
                <SignatureField label="Comptroller of Finance" />
              </div>
              <Separator className="my-4" />
              <div className="grid grid-cols-2 gap-6">
                <RemarksField label="Remarks of Concerned Dept." />
                <RemarksField label="Remarks of Account Dept." />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="flex justify-center mb-4">
        <button
          className="btn bg-[#0066ff] text-base text-white font-semibold px-3 py-1 rounded duration-500 hover:bg-[#3f37c9] download-button"
          onClick={generatePDF}
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default GenerateInvoice;

function SignatureField({ label }) {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2 text-sm font-medium text-gray-600">
        <Pen className="w-4 h-4" />
        <span>{label}</span>
      </div>
      <div className="h-12 border-b-2 border-dashed border-gray-300 hover:border-primary transition-colors duration-200" />
    </div>
  );
}

function RemarksField({ label }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <textarea
        className="w-full h-20 p-2 text-sm border rounded-md border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
        placeholder="Enter remarks here..."
      />
    </div>
  );
}
