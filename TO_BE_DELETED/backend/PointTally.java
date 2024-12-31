import java.util.HashMap;
import java.util.Scanner;

public class PointTally {
    // In-memory storage for user points
    private static HashMap<String, Integer> dailyPoints = new HashMap<>();
    private static HashMap<String, Integer> allTimePoints = new HashMap<>();

    // Method to add points for a user
    public static void addPoints(String username, int points) {
        dailyPoints.put(username, dailyPoints.getOrDefault(username, 0) + points);
        allTimePoints.put(username, allTimePoints.getOrDefault(username, 0) + points);
        System.out.println(points + " points added to " + username);
    }

    // Method to reset daily points for a user
    public static void resetDailyPoints(String username) {
        if (dailyPoints.containsKey(username)) {
            dailyPoints.put(username, 0);
            System.out.println("Daily points reset for " + username);
        } else {
            System.out.println("User not found!");
        }
    }

    // Method to display points for a user
    public static void displayPoints(String username) {
        int daily = dailyPoints.getOrDefault(username, 0);
        int allTime = allTimePoints.getOrDefault(username, 0);
        System.out.println("Points for " + username + ":");
        System.out.println("Daily Points: " + daily);
        System.out.println("All-Time Points: " + allTime);
    }

    // Main method
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.println("Welcome to the Point Tally System!");

        while (true) {
            System.out.println("\nMenu:");
            System.out.println("1. Add Points");
            System.out.println("2. Reset Daily Points");
            System.out.println("3. Display Points");
            System.out.println("4. Exit");
            System.out.print("Enter your choice: ");
            int choice = scanner.nextInt();
            scanner.nextLine(); // Consume newline

            switch (choice) {
                case 1:
                    System.out.print("Enter username: ");
                    String usernameAdd = scanner.nextLine();
                    System.out.print("Enter points to add: ");
                    int points = scanner.nextInt();
                    addPoints(usernameAdd, points);
                    break;

                case 2:
                    System.out.print("Enter username: ");
                    String usernameReset = scanner.nextLine();
                    resetDailyPoints(usernameReset);
                    break;

                case 3:
                    System.out.print("Enter username: ");
                    String usernameDisplay = scanner.nextLine();
                    displayPoints(usernameDisplay);
                    break;

                case 4:
                    System.out.println("Exiting... Goodbye!");
                    scanner.close();
                    return;

                default:
                    System.out.println("Invalid choice! Please try again.");
            }
        }
    }
}
