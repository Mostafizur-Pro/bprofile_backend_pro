import { connection } from "../app/config";

export const generateNextUserProfileId = () => {
  return new Promise((resolve, reject) => {
    // Perform asynchronous database query to get the next available user profile ID
    // For example, you might query the database to get the maximum profile ID and increment it by 1
    connection.query(
      "SELECT MAX(profile_id) AS max_profile_id FROM users",
      (error: any, results: any, fields: any) => {
        if (error) {
          console.error("Error generating next user profile ID:", error);
          reject(error);
        } else {
          // Extract the maximum profile ID from the database results
          const maxProfileId = results[0].max_profile_id;

          // Increment the maximum profile ID by 1 to get the next available ID
          const nextProfileId = maxProfileId
            ? parseInt(maxProfileId.replace("BP24U", "")) + 1
            : 1;

          // Format the next profile ID with the desired prefix
          const generatedId = `BP24U${nextProfileId
            .toString()
            .padStart(4, "0")}`;

          // Resolve the promise with the generated profile ID
          resolve(generatedId);
        }
      }
    );
  });
};
export const generateNextClientProfileId = () => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT MAX(profile_id) AS max_profile_id FROM client_data",
      (error: any, results: any, fields: any) => {
        if (error) {
          console.error("Error generating next client profile ID:", error);
          reject(error);
        } else {
          // Extract the maximum profile ID from the database results
          const maxProfileId = results[0].max_profile_id;

          // Increment the maximum profile ID by 1 to get the next available ID
          const nextProfileId = maxProfileId
            ? parseInt(maxProfileId.replace("BP24C", "")) + 1
            : 1;

          // Format the next profile ID with the desired prefix
          const generatedId = `BP24C${nextProfileId
            .toString()
            .padStart(4, "0")}`;

          // Resolve the promise with the generated profile ID
          resolve(generatedId);
        }
      }
    );
  });
};

export const generateNextAdminProfileId = () => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT MAX(profile_id) AS max_profile_id FROM admin_info",
      (error: any, results: any, fields: any) => {
        if (error) {
          console.error("Error generating next admin profile ID:", error);
          reject(error);
        } else {
          // Extract the maximum profile ID from the database results
          const maxProfileId = results[0].max_profile_id;

          // Increment the maximum profile ID by 1 to get the next available ID
          const nextProfileId = maxProfileId
            ? parseInt(maxProfileId.replace("BP24A", "")) + 1
            : 1;

          // Format the next profile ID with the desired prefix
          const generatedId = `BP24A${nextProfileId
            .toString()
            .padStart(4, "0")}`;

          // Resolve the promise with the generated profile ID
          resolve(generatedId);
        }
      }
    );
  });
};

export const generateNextEmployeeProfileId = () => {
  return new Promise((resolve, reject) => {
      const currentMonth = new Date().getMonth() + 1; // Adding 1 because getMonth() returns zero-based month
      const currentYear = new Date().getFullYear().toString().slice(-2); // Extracting last 2 digits of current year
      const prefix = `BP${currentMonth.toString().padStart(2, "0")}${currentYear}F`;

      connection.query(
          "SELECT MAX(profile_id) AS max_profile_id FROM employee_info WHERE profile_id LIKE ?",
          [`${prefix}%`], // Using prefix to filter maximum profile IDs for the current month and year
          (error: any, results: any, fields: any) => {
              if (error) {
                  console.error("Error generating next employee profile ID:", error);
                  reject(error);
              } else {
                  // Extract the maximum profile ID from the database results
                  const maxProfileId = results[0].max_profile_id;

                  // Increment the maximum profile ID by 1 to get the next available ID
                  const nextProfileId = maxProfileId
                      ? parseInt(maxProfileId.replace(prefix, "")) + 1
                      : 1;

                  // Format the next profile ID with the desired prefix and unique identifier
                  const generatedId = `${prefix}${nextProfileId.toString().padStart(4, "0")}`;

                  // Resolve the promise with the generated profile ID
                  resolve(generatedId);
              }
          }
      );
  });
};
