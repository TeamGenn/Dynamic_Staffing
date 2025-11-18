import requests
from dotenv import load_dotenv
import os
import json

load_dotenv()

headers = {
    "x-service-key": os.environ.get("OPUS_API_KEY")
}

def job_initiate():

    data = {
    "workflowId": "CIAwZYFzQJwmADQN",
    "title": "testing_webhook",
    "description": "this_is_test_job"
    }


    response = requests.post("https://operator.opus.com/job/initiate", headers=headers, json=data)

    return response.text

def job_execute(job_id):

    data = {
    "jobExecutionId": job_id,
    "jobPayloadSchemaInstance": {
        "workflow_input_0yd7byu7p": {
            "value": [
                {
                    "task_id": "a1f9c2e4-7b23-4d5f-8a2c-1b9c3f7d2e01",
                    "task_type": "customer_support",
                    "priority": 2,
                    "start_datetisme": "2025-11-17T09:00:00",
                    "end_datetime": "2025-11-17T09:45:00"
                },
                {
                    "task_id": "d2b3f1a8-5e6f-42b1-9c7d-3f2b1e5c6a7d",
                    "task_type": "technical_issue",
                    "priority": 4,
                    "start_datetime": "2025-11-17T8:00:00",
                    "end_datetime": "2025-11-17T11:00:00"
                }
        ],
            "type": "array"
        }
    }
}


    response = requests.post("https://operator.opus.com/job/execute", headers=headers, json=data)

    return response.text

def get_job_results(job_exec_id):

    response = requests.get(f"https://operator.opus.com/job/{job_exec_id}/results", headers=headers)

    print(response.text)

job_exec_id = json.loads(job_initiate())["jobExecutionId"]

print("Job Exec Id:", job_exec_id)

print(job_execute(job_exec_id))

get_job_results(job_exec_id)