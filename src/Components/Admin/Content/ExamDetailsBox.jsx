import { Button } from '@/components(shadcn)/ui/button';
import { server } from '@/main';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import MakePayment from './MakePayment';

const ExamDetailsBox = ({id}) => {
  // console.log("exam id is",id);
    const [data, setData] = useState({});
    const [loding, setLoding] = useState(false);
    const[batchId,setBatchId]=useState(null);
    const [showPreInvoice, setShowPreInvoice] = useState(false); 
    const navigate=useNavigate();
    //function for fetch exam details by id
    useEffect(() => {
        try {
          setLoding(true);
          axios
            .get(`${server}/exam/${id}`, {
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
              setBatchId(response.data.data.batchId._id)
              console.log(response.data.data)
            });
        } catch (error) {
          setLoding(false);
          console.error("Error fetching training partner:", error);
          throw error;
        }
      }, []);
      //funcrion for navigation..
      const handleViewResult = () => {
        //eexam detail's have  batch id by the basis of batch id i find the list of studen....
        navigate(`/admin/dasbord/batch/mark/students/${batchId}`);
      };
  return (
    <div>
      <div className="w-full mt-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <div className="p-3">
            <h3 className="text-lg font-medium mb-2">Training Partner Name*</h3>
            <p className="text-lg ">{data?.TrainingOrganization}</p>
          </div>
          <div className="p-3">
            <h3 className="text-lg font-medium mb-2">AssessmentAgency Name*</h3>
            <p className="text-lg ">{data?.assesmentAgency}</p>
          </div>
          <div className="p-3">
            <h3 className="text-lg font-medium mb-2">Batch ABN No*</h3>
            <p className="text-lg ">{data?.batchABN}</p>
          </div>
          <div className="p-3">
            <h3 className="text-lg font-medium mb-2">No of Student*</h3>
            <p className="text-lg text-blue-700 ">{data?.batchId?.students?.length}</p>
          </div>
          <div className="p-3">
            <h3 className="text-lg font-medium mb-2">Center Name*</h3>
            <p className="text-lg text-blue-700">{data?.batchId?.centerName}</p>
          </div>
          <div className="p-3">
            <h3 className="text-lg font-medium mb-2">Date of Examination*</h3>
            <p className="text-lg ">{data?.date?.split("T")[0]}</p>
          </div>
          <div className="p-3">
            <h3 className="text-lg font-medium mb-2">Date of Upload*</h3>
            <p className="text-lg ">{data?.updatedAt?.split("T")[0]}</p>
          </div>
          <div className="p-3">
            <h3 className="text-lg font-medium mb-2">Exam Under Course*</h3>
            <p className="text-lg ">{data?.course}</p>
          </div>
          <div className="p-3">
            <h3 className="text-lg font-medium mb-2">Exam Under Scheme*</h3>
            <p className="text-lg ">{data?.scheme}</p>
          </div>
          <div className="p-3">
            <h3 className="text-lg font-medium mb-2">Exam Under Sector*</h3>
            <p className="text-lg ">{data?.sector}</p>
          </div>
          <div className="p-3">
            <h3 className="text-lg font-medium mb-2">Batch Under State*</h3>
            <p className="text-lg ">{data?.state}</p>
          </div>
          <div className="p-3">
            <h3 className="text-lg font-medium mb-2">Status*</h3>
            <p className="text-xl font-bold ">{data?.status}</p>
          </div>
          <div className="p-3">
            <h3 className="text-lg font-medium mb-2">Payment Status*</h3>
            <p className="text-lg font-semibold  text-red-400">{data?.paymentStatus===true?"Paid":"Create invoice and make payment"}</p>
          </div>
          
          {/*
           
          */}
          
        </div>
        {/* shoow pree invoice */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          {/* Buttion For assin a batch */}

          {/* here admin can see the result of the  student */}
          <div>
          {
             data?.markUploadAndExamCompleteStatus===true?(
             <Button
              className={"bg-red-800"}
              onClick={handleViewResult}
              >
             View Result
             </Button>
             ):""
          }
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExamDetailsBox
