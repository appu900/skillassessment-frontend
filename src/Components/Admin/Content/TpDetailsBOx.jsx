import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components(shadcn)/ui/table";
import { Button } from "@/components(shadcn)/ui/button";
import { TooltipProvider } from "@/components(shadcn)/ui/tooltip";
// import { useRecoilValue } from "recoil";
// import { trainingPartnerByID } from "@/Pages/Admin/Atoms/TpSelector";
import axios from "axios";
import { server } from "@/main";
import Loder from "../ui/Loder";
import { useRecoilValue } from "recoil";
import { authenticationState } from "@/Pages/Admin/Atoms/atoms";
import { toast } from "react-toastify";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components(shadcn)/ui/popover";
import { Label } from "@/components(shadcn)/ui/label";
import { Input } from "@/components(shadcn)/ui/input";

const TpDetailsBOx = ({ id }) => {
  const [referesh, setReferesh] = useState(false);
  const [data, setData] = useState({});
  const [loding, setLoding] = useState(false);
  const [batch, setBatch] = useState([]);
  const [course, setCourse] = useState([]);
  const [sector, setSector] = useState([]);
  const [amount, setAmount] = useState(null);


  //function for fetch batch by tpID............
  useEffect(() => {
    try {
      setLoding(true);
      axios
        .get(`${server}/batch/tp/${id}`, {
          withCredentials: true,
          headers: {
            "Cache-Control": "no-cache",
            'Pragma': "no-cache",
            'Expires': "0",
          },
        })
        .then((response) => {
          setLoding(false);
          setBatch(response.data.data.reverse());
          console.log(response.data.data)
          setReferesh((prev) => !prev);
        });
    } catch (error) {
      setLoding(false);
      console.log(error);
    }
  }, []);

  //function for  fetch data by id of traning partner.
  useEffect(() => {
    try {
      setLoding(true);
      axios
        .get(`${server}/tp/${id}`, {
          withCredentials: true,
          headers: {
            "Cache-Control": "no-cache",
            'Pragma': "no-cache",
            'Expires': "0",
          },
        })
        .then((response) => {
          setLoding(false);
          setData(response.data.data);
          setReferesh((prev) => !prev);
          console.log(response.data.data);
          setCourse(response.data.data.courses);
          setSector(response.data.data.sector);
        });
    } catch (error) {
      setLoding(false);
      console.error("Error fetching training partner:", error);
      throw error;
    }
  }, []);

  //function for approve the application
  const authState = useRecoilValue(authenticationState);
  const applicationApproved = async () => {
    setLoding(true);
    const token = authState.token;
    if (!token) {
      console.log("Admin not  found");
      return;
    }
    try {
      const responce = await axios.put(
        `${server}/tp/approve/${id}`,
        { amount },
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );
      setLoding(false);
      toast.success(responce.data.message, {
        position: "bottom-right",
        closeOnClick: true,
        draggable: true,
        theme: "colored",
      });
      setData(responce.data.data);
    } catch (error) {
      setLoding(false);
      toast.error("Somthing went wrong", {
        position: "bottom-right",
        closeOnClick: true,
        draggable: true,
        theme: "colored",
      });
    }
  };

  //function for reject the application
  const applicationReject = async () => {
    setLoding(true);
    const token = authState.token;
    if (!token) {
      console.log("Admin not  found");
      return;
    }
    try {
      const responce = await axios.put(
        `${server}/tp/reject/${id}`,
        {},
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json",
          },
        }
      );
      setLoding(false);
      toast.success(responce.data.message, {
        position: "bottom-right",
        closeOnClick: true,
        draggable: true,
        theme: "colored",
      });
      setData(responce.data.data);
    } catch (error) {
      setLoding(false);
      toast.success("Somthing went wrong", {
        position: "bottom-right",
        closeOnClick: true,
        draggable: true,
        theme: "colored",
      });
    }
  };

  //function for add amount manualy for a traningPartner
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoding(true);
    // try {
    //   const response = await axios.put(
    //     `${server}/batch/addpayment/${id}`,
    //     {amount},
    //     {
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       withCredentials: true,
    //     }
    //   );
    //   setAmount("");
    
    //   toast.success("Cost added !!", {
    //     position: "top-center",
    //     closeOnClick: true,
    //     draggable: true,
    //     theme: "colored",
    //   });
    //   setLoding(false);
    // } catch (error) {
    //     console.log(error)
    //   toast.error("Something went wrong, try after some time !!!", {
    //     position: "top-center",
    //     closeOnClick: true,
    //     draggable: true,
    //     theme: "colored",
    //   });
    //   setLoding(false);
    // }
  };

  const defaultUserPhoto = "/user.png";
  if (loding) {
    return <Loder />;
  }
  return (
    <TooltipProvider>
      <div className="m-4 md:m-10">
        <div className="flex flex-col md:flex-row justify-center mx-4 md:mx-10"> 
          <div className="w-full md:w-3/4">
            <Table>
              <TableBody>
                <TableRow className="text-lg border-none h-[5px]">
                  <TableCell className="font-medium">
                    OrganizationName*
                  </TableCell>
                  <TableCell className="pl-4 md:pl-24 text-lg">
                    {data && data.organizationName}
                  </TableCell>
                </TableRow>
                <TableRow className="text-lg border-none">
                  <TableCell className="font-medium">
                    OrganizationCategory*
                  </TableCell>
                  <TableCell className="pl-4 md:pl-24 text-lg">
                    {data && data.organizationCategory}
                  </TableCell>
                </TableRow>
                <TableRow className="text-lg border-none">
                  <TableCell className="font-medium">CenterId*</TableCell>
                  <TableCell className="pl-4 md:pl-24 text-lg">
                    {data && data.centerId}
                  </TableCell>
                </TableRow>
                <TableRow className="text-lg border-none">
                  <TableCell className="font-medium">TpCode *</TableCell>
                  <TableCell className="pl-4 md:pl-24 text-lg">
                    {data && data.tpCode}
                  </TableCell>
                </TableRow>
                <TableRow className="text-lg border-none">
                  <TableCell className="font-medium">Scheme*</TableCell>
                  <TableCell className="pl-4 md:pl-24 text-lg">
                    {data && data.scheme}
                  </TableCell>
                </TableRow>
                <TableRow className="text-lg border-none">
                  <TableCell className="font-medium">Affiliation *</TableCell>
                  <TableCell className="pl-4 md:pl-24 text-lg">
                    {data && data.affiliation}
                  </TableCell>
                </TableRow>
                <TableRow className="text-lg border-none">
                  <TableCell className="font-medium">Website *</TableCell>
                  <TableCell className="pl-4 md:pl-24 text-lg">
                    {data && data.website}
                  </TableCell>
                </TableRow>
                <TableRow className="text-lg border-none">
                  <TableCell className="font-medium">Pan No *</TableCell>
                  <TableCell className="pl-4 md:pl-24 text-lg">
                    {data && data.pan}
                  </TableCell>
                </TableRow>
                <TableRow className="text-lg border-none">
                  <TableCell className="font-medium">PRN No *</TableCell>
                  <TableCell className="pl-4 md:pl-24 text-lg">
                    {data && data.prnNo}
                  </TableCell>
                </TableRow>
                <TableRow className="text-lg border-none">
                  <TableCell className="font-medium">
                    Courses Provided By Traning Partner *
                  </TableCell>
                  <TableCell className="pl-4 md:pl-24 text-lg">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline">Show Course</Button>
                      </PopoverTrigger>

                      {course &&
                        course.map((courses, index) => (
                          <PopoverContent key={index} className="bg-green-300">
                            {courses}
                          </PopoverContent>
                        ))}
                    </Popover>
                  </TableCell>
                </TableRow>
                <TableRow className="text-lg border-none">
                  <TableCell className="font-medium">
                    Available Sector*
                  </TableCell>
                  <TableCell className="pl-4 md:pl-24 text-lg">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline">Show Sector</Button>
                      </PopoverTrigger>

                      {sector &&
                        sector.map((sectors, index) => (
                          <PopoverContent key={index} className="bg-green-300">
                            {sectors}
                          </PopoverContent>
                        ))}
                    </Popover>
                  </TableCell>
                </TableRow>
                <TableRow className="text-lg border-none">
                  <TableCell className="font-medium">
                    View Certificate's*
                  </TableCell>
                  <TableCell className="pl-4 md:pl-24 text-lg">
                    
                        <Button variant="outline">Show</Button>
                      
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            {/* table for registered office Address */}
            
            <div className="w-full mt-5"> 
              <p className="text-xl  font-semibold underline">
                Registered Office Details
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                <div className="p-3">
                  <h3 className="text-lg font-medium mb-2">Address*</h3>
                  <p className="text-lg border-b-[1px]">
                    {data && data.registeredOfficeAddress}
                  </p>
                </div>
                <div className="p-3">
                  <h3 className="text-lg font-medium mb-2">Dist*</h3>
                  <p className="text-lg border-b-[1px]">
                    {data && data.registeredOfficeDist}
                  </p>
                </div>
                <div className="p-3">
                  <h3 className="text-lg font-medium mb-2">City*</h3>
                  <p className="text-lg border-b-[1px]">
                    {data && data.registeredOfficeCity}
                  </p>
                </div>
                <div className="p-3">
                  <h3 className="text-lg font-medium mb-2">State*</h3>
                  <p className="text-lg border-b-[1px]">
                    {data && data.registeredOfficeState}
                  </p>
                </div>
                <div className="p-3">
                  <h3 className="text-lg font-medium mb-2">Pin*</h3>
                  <p className="text-lg border-b-[1px]">
                    {data && data.registeredOfficePin}
                  </p>
                </div>
                <div className="p-3">
                  <h3 className="text-lg font-medium mb-2">Telephone no*</h3>
                  <p className="text-lg border-b-[1px]">
                    {data && data.registeredOfficeTelephone}
                  </p>
                </div>
                <div className="p-3">
                  <h3 className="text-lg font-medium mb-2">Mobile no*</h3>
                  <p className="text-lg border-b-[1px]">
                    {data && data.registeredOfficeMobile}
                  </p>
                </div>
                <div className="p-3">
                  <h3 className="text-lg font-medium mb-2">Fax no*</h3>
                  <p className="text-lg border-b-[1px]">
                    {data && data.registeredOfficeFax}
                  </p>
                </div>
                <div className="p-3">
                  <h3 className="text-lg font-medium mb-2">Email *</h3>
                  <p className="text-lg border-b-[1px]">
                    {data && data.registeredOfficeEmail}
                  </p>
                </div>
                <div className="p-3">
                  <h3 className="text-lg font-medium mb-2">Gst no*</h3>
                  <p className="text-lg border-b-[1px]">
                    {data && data.registeredOfficeGst}
                  </p>
                </div>
              </div>
            </div>
            {/* table for  Regional state */}
            <div className="w-full mt-5">
              <p className="text-xl font-semibold underline">
                Details of Regional State Office
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                <div className="p-3">
                  <h3 className="text-lg font-medium mb-2">Address*</h3>
                  <p className="text-lg border-b-[1px]">
                    {data && data.regionalStateOfficeAddress}
                  </p>
                </div>
                <div className="p-3">
                  <h3 className="text-lg font-medium mb-2">Dist*</h3>
                  <p className="text-lg border-b-[1px]">
                    {data && data.regionalStateOfficeDist}
                  </p>
                </div>
                <div className="p-3">
                  <h3 className="text-lg font-medium mb-2">City*</h3>
                  <p className="text-lg border-b-[1px]">
                    {data && data.regionalStateOfficeCity}
                  </p>
                </div>
                <div className="p-3">
                  <h3 className="text-lg font-medium mb-2">State*</h3>
                  <p className="text-lg border-b-[1px]">
                    {data && data.regionalStateOfficeState}
                  </p>
                </div>
                <div className="p-3">
                  <h3 className="text-lg font-medium mb-2">Pin*</h3>
                  <p className="text-lg border-b-[1px]">
                    {data && data.regionalStateOfficePin}
                  </p>
                </div>
                <div className="p-3">
                  <h3 className="text-lg font-medium mb-2">Telephone no*</h3>
                  <p className="text-lg border-b-[1px]">
                    {data && data.regionalStateOfficeTelephone}
                  </p>
                </div>
                <div className="p-3">
                  <h3 className="text-lg font-medium mb-2">Mobile no*</h3>
                  <p className="text-lg border-b-[1px]">
                    {data && data.regionalStateOfficeMobile}
                  </p>
                </div>
                <div className="p-3">
                  <h3 className="text-lg font-medium mb-2">Fax no*</h3>
                  <p className="text-lg border-b-[1px]">
                    {data && data.regionalStateOfficeFax}
                  </p>
                </div>
                <div className="p-3">
                  <h3 className="text-lg font-medium mb-2">Email *</h3>
                  <p className="text-lg border-b-[1px]">
                    {data && data.regionalStateOfficeEmail}
                  </p>
                </div>
                <div className="p-3">
                  <h3 className="text-lg font-medium mb-2">Gst no*</h3>
                  <p className="text-lg border-b-[1px]">
                    {data && data.regionalStateOfficeGst}
                  </p>
                </div>
              </div>
            </div>
            {/* About head woner  */}
            <div className="w-full mt-5">
              <p className="text-xl  font-semibold underline">
                {" "}
                Details of HeadOwner
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                <div className="p-3">
                  <h3 className="text-lg font-medium mb-2">Name*</h3>
                  <p className="text-lg border-b-[1px]">
                    {data && data.headOwnerName}
                  </p>
                </div>
                <div className="p-3">
                  <h3 className="text-lg font-medium mb-2">Date of berth*</h3>
                  <p className="text-lg border-b-[1px]">
                    {data && data.headOwnerDob}
                  </p>
                </div>
                <div className="p-3">
                  <h3 className="text-lg font-medium mb-2">City*</h3>
                  <p className="text-lg border-b-[1px]">
                    {data && data.headOwnerCity}
                  </p>
                </div>
                <div className="p-3">
                  <h3 className="text-lg font-medium mb-2">ResAddress*</h3>
                  <p className="text-lg border-b-[1px]">
                    {data && data.headOwnerResAddress}
                  </p>
                </div>
                <div className="p-3">
                  <h3 className="text-lg font-medium mb-2">
                    PermanentAddress*
                  </h3>
                  <p className="text-lg border-b-[1px]">
                    {data && data.headOwnerPermanentAddress}
                  </p>
                </div>
                <div className="p-3">
                  <h3 className="text-lg font-medium mb-2">Mobile no*</h3>
                  <p className="text-lg border-b-[1px]">
                    {data && data.headOwnerMobile}
                  </p>
                </div>
                <div className="p-3">
                  <h3 className="text-lg font-medium mb-2">
                    Alternative Mobile no*
                  </h3>
                  <p className="text-lg border-b-[1px]">
                    {data && data.headOwnerAltMobile}
                  </p>
                </div>
                <div className="p-3">
                  <h3 className="text-lg font-medium mb-2">Qualification*</h3>
                  <p className="text-lg border-b-[1px]">
                    {data && data.headOwnerQualification}
                  </p>
                </div>
                <div className="p-3">
                  <h3 className="text-lg font-medium mb-2">Email *</h3>
                  <p className="text-lg border-b-[1px]">
                    {data && data.headOwnerEmail}
                  </p>
                </div>
                <div className="p-3">
                  <h3 className="text-lg font-medium mb-2">Experience*</h3>
                  <p className="text-lg border-b-[1px]">
                    {data && data.headOwnerWorkExperience}
                  </p>
                </div>
                <div className="p-3">
                  <h3 className="text-lg font-medium mb-2">Pan No*</h3>
                  <p className="text-lg border-b-[1px]">
                    {data && data.headOwnerPanNo}
                  </p>
                </div>
                <div className="p-3">
                  <h3 className="text-lg font-medium mb-2">Aadhar No*</h3>
                  <p className="text-lg border-b-[1px]">
                    {data && data.headOwnerAadharNo}
                  </p>
                </div>
                <div className="p-3">
                  <h3 className="text-lg font-medium mb-2">Promoter1*</h3>
                  <p className="text-lg border-b-[1px]">
                    {data && data.headOwnerPromoter1}
                  </p>
                </div>
                <div className="p-3">
                  <h3 className="text-lg font-medium mb-2">Promoter2*</h3>
                  <p className="text-lg border-b-[1px]">
                    {data && data.headOwnerPromoter2}
                  </p>
                </div>
                <div className="p-3">
                  <h3 className="text-lg font-medium mb-2">Promoter3*</h3>
                  <p className="text-lg border-b-[1px]">
                    {data && data.headOwnerPromoter3}
                  </p>
                </div>
              </div>
            </div>
            {/* about project contact */}
            <div className="w-full mt-5">
              <p className="text-xl font-semibold underline">
                Details of Project Contact Person
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                <div className="p-3">
                  <h3 className="text-lg font-medium mb-2">PersonName*</h3>
                  <p className="text-lg border-b-[1px]">
                    {data && data.projectContactPersonName}
                  </p>
                </div>
                <div className="p-3">
                  <h3 className="text-lg font-medium mb-2">
                    PersonDesignation*
                  </h3>
                  <p className="text-lg border-b-[1px]">
                    {data && data.projectContactPersonDesignation}
                  </p>
                </div>
                <div className="p-3">
                  <h3 className="text-lg font-medium mb-2">City*</h3>
                  <p className="text-lg border-b-[1px]">
                    {data && data.projectContactPersonCity}
                  </p>
                </div>
                <div className="p-3">
                  <h3 className="text-lg font-medium mb-2">Mobile No*</h3>
                  <p className="text-lg border-b-[1px]">
                    {data && data.projectContactPersonMobile}
                  </p>
                </div>
                <div className="p-3">
                  <h3 className="text-lg font-medium mb-2">Alt Mobile No*</h3>
                  <p className="text-lg border-b-[1px]">
                    {data && data.projectContactPersonAltMobile}
                  </p>
                </div>
                <div className="p-3">
                  <h3 className="text-lg font-medium mb-2">Res Address*</h3>
                  <p className="text-lg border-b-[1px]">
                    {data && data.projectContactPersonResAddress}
                  </p>
                </div>
                <div className="p-3">
                  <h3 className="text-lg font-medium mb-2">
                    Permanent Address*
                  </h3>
                  <p className="text-lg border-b-[1px]">
                    {data && data.projectContactPersonPermanentAddress}
                  </p>
                </div>
                <div className="p-3">
                  <h3 className="text-lg font-medium mb-2">Email *</h3>
                  <p className="text-lg border-b-[1px]">
                    {data && data.projectContactPersonEmail}
                  </p>
                </div>
                <div className="p-3">
                  <h3 className="text-lg font-medium mb-2">Alt Email*</h3>
                  <p className="text-lg border-b-[1px]">
                    {data && data.projectContactPersonAltEmail}
                  </p>
                </div>
              </div>
            </div>
            {/* about payment */}

            <div className="w-full mt-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
               
                <div className="p-3">
                  <h3 className="text-lg font-medium mb-2">Status*</h3>
                  <p className="text-lg ">{data && data.applicationStatus}</p>
                </div>
              </div>
            </div>
            {/*<div>
              {data.applicationStatus === "Approved" ? (
                <div>
                  <div className="font-bold text-l my-4 underline">
                    Batch under this Traning Partner
                  </div>
                  <DataTable
                    path={"/admin/dasbord"}
                    columns={batchColumns}
                    data={batch && batch}
                    isLoding={loding}
                  />
                </div>
              ) : (
                ""
              )}
            </div>*/}
          </div>
          
          </div>
        </div>
        {/* field for add amount for tp according to scheme */}
       {data?.applicationStatus==="Pending" && data?.scheme==="corporate"? <div className="p-8 w-[500px] relative left-44">
        <form onSubmit={applicationApproved}>
        <Label htmlFor="name" className="text-left w-40 text-lg">
          Add cost per Student for this Traning Partner..
        </Label>
        <Input
          id="scheme-name"
          className="col-span-4 py-6 mt-2"
          placeholder="Add amount in rupee"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        </form>
      </div>:""}
        <div className="flex  md:flex-row justify-between mt-6 md:mx-10 w-full md:w-[625px] relative left-44">
          <Button
            onClick={applicationReject}
            className="bg-red-600 hover:bg-red-400  w-full md:w-auto mb-4 md:mb-0 "
            disabled={data?.applicationStatus === "Approved" || data?.applicationStatus === "Rejected"}
          > 
            {" "}
            {loding
              ? "Loding..."
              : data.applicationStatus === "Rejected"
              ? "Rejected"
              : "Reject"}
          </Button>
          <Button
            onClick={applicationApproved}
            className=" bg-green-600 hover:bg-green-400 w-full md:w-auto"
            disabled={data?.applicationStatus === "Rejected" ||data?.applicationStatus === "Approved" || (data?.scheme==="corporate" && amount===null)}
          >
            {loding
              ? "Loding..."
              : data.applicationStatus === "Approved"
              ? "Approved"
              : "Approve"}
          </Button>
        </div>
      
    </TooltipProvider>
  );
};

export default TpDetailsBOx;
