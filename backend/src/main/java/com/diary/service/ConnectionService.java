package com.diary.service;

import com.diary.model.Connection;
import com.diary.model.User;
import com.diary.repository.ConnectionRepository;
import com.diary.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ConnectionService {

    private final ConnectionRepository connectionRepository;
    private final UserRepository userRepository;

    public ConnectionService(ConnectionRepository connectionRepository, UserRepository userRepository) {
        this.connectionRepository = connectionRepository;
        this.userRepository = userRepository;
    }

    // Send a friend request
    public Connection sendRequest(User requester, Long addresseeId) {
        if (requester.getId().equals(addresseeId)) {
            throw new RuntimeException("Cannot send friend request to yourself");
        }

        User addressee = userRepository.findById(addresseeId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if connection already exists
        Optional<Connection> existing = connectionRepository.findBetween(requester, addressee);
        if (existing.isPresent()) {
            Connection conn = existing.get();
            if (conn.getStatus() == Connection.Status.ACCEPTED) {
                throw new RuntimeException("Already friends");
            }
            if (conn.getStatus() == Connection.Status.PENDING) {
                // If the other person already sent a request, auto-accept
                if (conn.getAddressee().getId().equals(requester.getId())) {
                    conn.setStatus(Connection.Status.ACCEPTED);
                    return connectionRepository.save(conn);
                }
                throw new RuntimeException("Friend request already sent");
            }
            if (conn.getStatus() == Connection.Status.REJECTED) {
                // Allow re-requesting after rejection
                conn.setRequester(requester);
                conn.setAddressee(addressee);
                conn.setStatus(Connection.Status.PENDING);
                return connectionRepository.save(conn);
            }
        }

        Connection connection = new Connection(requester, addressee);
        return connectionRepository.save(connection);
    }

    // Accept a friend request
    public Connection acceptRequest(User currentUser, Long connectionId) {
        Connection conn = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new RuntimeException("Connection not found"));

        if (!conn.getAddressee().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Only the recipient can accept a request");
        }

        if (conn.getStatus() != Connection.Status.PENDING) {
            throw new RuntimeException("Request is not pending");
        }

        conn.setStatus(Connection.Status.ACCEPTED);
        return connectionRepository.save(conn);
    }

    // Reject/decline a friend request
    public void rejectRequest(User currentUser, Long connectionId) {
        Connection conn = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new RuntimeException("Connection not found"));

        if (!conn.getAddressee().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Only the recipient can reject a request");
        }

        conn.setStatus(Connection.Status.REJECTED);
        connectionRepository.save(conn);
    }

    // Remove a friend (unfriend)
    public void removeFriend(User currentUser, Long userId) {
        User otherUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Connection conn = connectionRepository.findBetween(currentUser, otherUser)
                .orElseThrow(() -> new RuntimeException("Connection not found"));

        connectionRepository.delete(conn);
    }

    // Get all accepted friends
    public List<User> getFriends(User user) {
        return connectionRepository.findAcceptedConnections(user).stream()
                .map(conn -> conn.getRequester().getId().equals(user.getId())
                        ? conn.getAddressee()
                        : conn.getRequester())
                .collect(Collectors.toList());
    }

    // Get pending incoming requests
    public List<Connection> getPendingRequests(User user) {
        return connectionRepository.findPendingForUser(user);
    }

    // Get pending sent requests
    public List<Connection> getSentRequests(User user) {
        return connectionRepository.findPendingSentByUser(user);
    }

    // Get connection status between current user and another user
    public String getConnectionStatus(User currentUser, User otherUser) {
        if (currentUser.getId().equals(otherUser.getId())) return "self";

        Optional<Connection> conn = connectionRepository.findBetween(currentUser, otherUser);
        if (conn.isEmpty()) return "none";

        Connection c = conn.get();
        if (c.getStatus() == Connection.Status.ACCEPTED) return "friends";
        if (c.getStatus() == Connection.Status.PENDING) {
            return c.getRequester().getId().equals(currentUser.getId()) ? "pending_sent" : "pending_received";
        }
        return "none";
    }

    public long getFriendCount(User user) {
        return connectionRepository.countFriends(user);
    }

    public long getPendingCount(User user) {
        return connectionRepository.countPendingRequests(user);
    }
}
