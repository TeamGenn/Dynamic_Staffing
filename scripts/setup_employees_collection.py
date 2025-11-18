from embed_employees import embed_employees

if __name__ == "__main__":

    with open("data/employees.csv", "r") as f:

        embed_employees(f)