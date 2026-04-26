package com.diary.repository;

import com.diary.model.Connection;
import com.diary.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface ConnectionRepository extends JpaRepository<Connection, Long> {

    // Find connection between two users in either direction
    @Query("SELECT c FROM Connection c WHERE " +
           "(c.requester = :u1 AND c.addressee = :u2) OR " +
           "(c.requester = :u2 AND c.addressee = :u1)")
    Optional<Connection> findBetween(@Param("u1") User u1, @Param("u2") User u2);

    // All accepted friends for a user (either direction)
    @Query("SELECT c FROM Connection c WHERE c.status = 'ACCEPTED' AND (c.requester = :user OR c.addressee = :user)")
    List<Connection> findAcceptedConnections(@Param("user") User user);

    // Pending requests received by a user
    @Query("SELECT c FROM Connection c WHERE c.addressee = :user AND c.status = 'PENDING'")
    List<Connection> findPendingForUser(@Param("user") User user);

    // Pending requests sent by a user
    @Query("SELECT c FROM Connection c WHERE c.requester = :user AND c.status = 'PENDING'")
    List<Connection> findPendingSentByUser(@Param("user") User user);

    // Count accepted friends
    @Query("SELECT COUNT(c) FROM Connection c WHERE c.status = 'ACCEPTED' AND (c.requester = :user OR c.addressee = :user)")
    long countFriends(@Param("user") User user);

    // Count pending incoming requests
    @Query("SELECT COUNT(c) FROM Connection c WHERE c.addressee = :user AND c.status = 'PENDING'")
    long countPendingRequests(@Param("user") User user);
}
