package com.diary.config;

import com.diary.model.Comment;
import com.diary.model.DiaryEntry;
import com.diary.model.EntryLike;
import com.diary.model.User;
import com.diary.repository.CommentRepository;
import com.diary.repository.DiaryEntryRepository;
import com.diary.repository.EntryLikeRepository;
import com.diary.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInit {

    @Bean
    CommandLineRunner initData(UserRepository userRepo, DiaryEntryRepository diaryRepo,
                               CommentRepository commentRepo, EntryLikeRepository likeRepo,
                               PasswordEncoder encoder) {
        return args -> {
            // Create demo users (all pre-verified for dev convenience)
            User alice = new User("alice", "alice@example.com", encoder.encode("password123"));
            alice.setBio("Lover of sunsets and good books 📚");
            alice.setEmailVerified(true);
            alice = userRepo.save(alice);

            User bob = new User("bob", "bob@example.com", encoder.encode("password123"));
            bob.setBio("Coffee addict & code writer ☕");
            bob.setEmailVerified(true);
            bob = userRepo.save(bob);

            User charlie = new User("charlie", "charlie@example.com", encoder.encode("password123"));
            charlie.setBio("Wanderer of thoughts and trails 🌿");
            charlie.setEmailVerified(true);
            charlie = userRepo.save(charlie);

            // Create demo diary entries
            DiaryEntry entry1 = diaryRepo.save(new DiaryEntry(alice,
                    "A Beautiful Morning",
                    "Woke up early today and watched the sunrise from my balcony. The sky was painted in shades of pink and orange. It reminded me why mornings can be magical if you just take a moment to notice.",
                    "😊", true));

            DiaryEntry entry2 = diaryRepo.save(new DiaryEntry(alice,
                    "Rainy Day Thoughts",
                    "The rain hasn't stopped all day. There's something comforting about the sound of raindrops against the window. Made myself a hot cup of chai and spent the afternoon reading.",
                    "🤔", true));

            DiaryEntry entry3 = diaryRepo.save(new DiaryEntry(alice,
                    "Private Reflection",
                    "Some thoughts are just for me. Today I realized how much I've grown over the past year. Not everything needs to be shared.",
                    "😌", false));

            DiaryEntry entry4 = diaryRepo.save(new DiaryEntry(bob,
                    "First Day at New Job",
                    "Started my new job today! The team is amazing and the office has a great vibe. Nervous but excited for what's ahead. Already made a friend at the coffee machine.",
                    "😊", true));

            DiaryEntry entry5 = diaryRepo.save(new DiaryEntry(bob,
                    "Weekend Adventure",
                    "Hiked to the top of Cedar Ridge today. The view was absolutely breathtaking. Sometimes you need to climb a mountain to put things in perspective.",
                    "😊", true));

            DiaryEntry entry6 = diaryRepo.save(new DiaryEntry(charlie,
                    "Midnight Musings",
                    "Can't sleep tonight. My mind keeps wandering to all the things I want to create. There's a project I've been dreaming about — a place where people can share their daily thoughts like pages from a diary. Maybe one day.",
                    "🤔", true));

            // Add demo likes
            likeRepo.save(new EntryLike(bob, entry1));
            likeRepo.save(new EntryLike(charlie, entry1));
            likeRepo.save(new EntryLike(alice, entry4));
            likeRepo.save(new EntryLike(charlie, entry4));
            likeRepo.save(new EntryLike(alice, entry5));
            likeRepo.save(new EntryLike(bob, entry6));
            likeRepo.save(new EntryLike(alice, entry6));
            likeRepo.save(new EntryLike(charlie, entry2));

            // Add demo comments
            commentRepo.save(new Comment("This is so beautifully written! 🌅", bob, entry1));
            commentRepo.save(new Comment("I feel the same way about mornings.", charlie, entry1));
            commentRepo.save(new Comment("Congrats on the new job! 🎉", alice, entry4));
            commentRepo.save(new Comment("Welcome aboard, Bob!", charlie, entry4));
            commentRepo.save(new Comment("Cedar Ridge is stunning. I need to go there!", alice, entry5));
            commentRepo.save(new Comment("Rainy days are the best for reading.", bob, entry2));
            commentRepo.save(new Comment("Build it! I'd love to use something like that.", alice, entry6));

            System.out.println("✅ Demo data loaded: 3 users, 6 entries, 8 likes, 7 comments");
        };
    }
}
