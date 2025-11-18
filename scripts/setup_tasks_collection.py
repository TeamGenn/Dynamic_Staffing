from embed_tasks import embed_tasks

if __name__ == "__main__":

    with open("data/historical_tasks.csv", "r") as f:

        embed_tasks(f)