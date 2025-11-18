import requests
from dotenv import load_dotenv
import os
import json

load_dotenv()

headers = {
    "x-service-key": os.environ.get("OPUS_API_KEY")
}

def job_initiate(title, description):

    try:

        data = {
        "workflowId": "CIAwZYFzQJwmADQN",
        "title": title,
        "description": description
        }

        response = requests.post("https://operator.opus.com/job/initiate", headers=headers, json=data)

        return response.text
    
    except Exception as e:

        print("Error @job_initiate():", e)

        return None

def job_execute(job_id, task):

    try:

        data = {
            "jobExecutionId": job_id,
            "jobPayloadSchemaInstance": {
                "workflow_input_0yd7byu7p": {
                    "value": {
                        "task": {
                            "id": "_qoea5zqto",
                            "variable_name": "task",
                            "type": "object",
                            "type_definition": {
                            "task_id": {
                                "id": "_sn7as1idv",
                                "variable_name": "task_id",
                                "type": "str"
                            },
                            "task_type": {
                                "id": "_t2c7seh83",
                                "variable_name": "task_type",
                                "type": "str"
                            },
                            "duration_minutes": {
                                "id": "_0e6ym46s0",
                                "variable_name": "duration_minutes",
                                "type": "str"
                            },
                            "priority": {
                                "id": "_0cxuj4dup",
                                "variable_name": "priority",
                                "type": "float"
                            },
                            "required_skills": {
                                "id": "_3889yq5qa",
                                "variable_name": "required_skills",
                                "type": "str"
                            },
                            "start_datetime": {
                                "id": "_caye1c2qg",
                                "variable_name": "start_datetime",
                                "type": "str"
                            },
                            "end_datetime": {
                                "id": "_i9wufvhud",
                                "variable_name": "end_datetime",
                                "type": "str"
                            }
                            }
                        }
                        },
                    "type": "object"
                }
            }
        }

        response = requests.post("https://operator.opus.com/job/execute", headers=headers, json=data)

        return response.text
    
    except Exception as e:

        print("Error @job_execute():", e)

        return None

def get_job_results(job_exec_id):

    try:

        response = requests.get(f"https://operator.opus.com/job/{job_exec_id}/results", headers=headers)

        return response.text
    
    except Exception as e:

        print("Error @get_job_results():", e)

        return None

def execute_opus_workflow(title, description, workflow_id, payload):

    job_exec_id = json.loads(job_initiate())["jobExecutionId"]

    print("Job Exec Id:", job_exec_id)

    print(job_execute(job_exec_id))

    get_job_results(job_exec_id)


"""

{
  "task": {
    "id": "_qoea5zqto",
    "variable_name": "task",
    "type": "object",
    "type_definition": {
      "task_id": {
        "id": "_sn7as1idv",
        "variable_name": "task_id",
        "type": "str"
      },
      "task_type": {
        "id": "_t2c7seh83",
        "variable_name": "task_type",
        "type": "str"
      },
      "duration_minutes": {
        "id": "_0e6ym46s0",
        "variable_name": "duration_minutes",
        "type": "str"
      },
      "priority": {
        "id": "_0cxuj4dup",
        "variable_name": "priority",
        "type": "float"
      },
      "required_skills": {
        "id": "_3889yq5qa",
        "variable_name": "required_skills",
        "type": "str"
      },
      "start_datetime": {
        "id": "_caye1c2qg",
        "variable_name": "start_datetime",
        "type": "str"
      },
      "end_datetime": {
        "id": "_i9wufvhud",
        "variable_name": "end_datetime",
        "type": "str"
      }
    }
  }
}

"""