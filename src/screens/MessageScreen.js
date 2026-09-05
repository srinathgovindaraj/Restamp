import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Image,
  Pressable,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../constants/colors";

const INITIAL_CHATS = [
  {
    id: "1",
    name: "Wayan Sudra",
    role: "Bali Tour Guide",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    online: true,
    category: "Guides",
    lastMessage: "Looking forward to showing you the Ubud rice terraces tomorrow!",
    time: "10:42 AM",
    unread: 2,
    messages: [
      { id: "m1", sender: "them", text: "Om Swastiastu! Welcome to Bali! 🌴", time: "10:30 AM" },
      { id: "m2", sender: "me", text: "Hi Wayan! What time will we meet tomorrow?", time: "10:35 AM" },
      { id: "m3", sender: "them", text: "I will pick you up at your villa at 8:00 AM sharp.", time: "10:40 AM" },
      { id: "m4", sender: "them", text: "Looking forward to showing you the Ubud rice terraces tomorrow!", time: "10:42 AM" },
    ],
  },
  {
    id: "2",
    name: "Stefan Keller",
    role: "Swiss Alps Expedition",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    online: true,
    category: "Guides",
    lastMessage: "The mountain weather is clear for the Jungfrau rail trek.",
    time: "Yesterday",
    unread: 0,
    messages: [
      { id: "m1", sender: "them", text: "Hello! Don't forget your warm layers for tomorrow.", time: "Yesterday" },
      { id: "m2", sender: "them", text: "The mountain weather is clear for the Jungfrau rail trek.", time: "Yesterday" },
    ],
  },
  {
    id: "3",
    name: "Tourvaa Concierge",
    role: "24/7 Premium Support",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    online: false,
    category: "Support",
    lastMessage: "Your flight transfer confirmation has been sent to your email.",
    time: "2 days ago",
    unread: 0,
    messages: [
      { id: "m1", sender: "them", text: "Hi Alex, your booking #TV-8821 is confirmed!", time: "2 days ago" },
      { id: "m2", sender: "them", text: "Your flight transfer confirmation has been sent to your email.", time: "2 days ago" },
    ],
  },
  {
    id: "4",
    name: "Elena Rostova",
    role: "Kyoto Heritage Host",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    online: false,
    category: "Guides",
    lastMessage: "I reserved our traditional matcha tea ceremony seats.",
    time: "3 days ago",
    unread: 0,
    messages: [
      { id: "m1", sender: "them", text: "Konnichiwa! I reserved our traditional matcha tea ceremony seats.", time: "3 days ago" },
    ],
  },
];

export default function MessageScreen() {
  const [chats, setChats] = useState(INITIAL_CHATS);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChat, setActiveChat] = useState(null);
  const [inputMessage, setInputMessage] = useState("");

  const filters = ["All", "Guides", "Support", "Unread"];

  const filteredChats = chats.filter((chat) => {
    const matchesSearch =
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedFilter === "All") return matchesSearch;
    if (selectedFilter === "Unread") return matchesSearch && chat.unread > 0;
    return matchesSearch && chat.category === selectedFilter;
  });

  const totalUnread = chats.reduce((acc, c) => acc + (c.unread || 0), 0);

  const openChat = (chat) => {
    // mark as read
    setChats((prev) =>
      prev.map((c) => (c.id === chat.id ? { ...c, unread: 0 } : c))
    );
    setActiveChat({ ...chat, unread: 0 });
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !activeChat) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: "me",
      text: inputMessage.trim(),
      time: "Just now",
    };

    const updatedActiveChat = {
      ...activeChat,
      lastMessage: newMsg.text,
      time: "Just now",
      messages: [...activeChat.messages, newMsg],
    };

    setActiveChat(updatedActiveChat);
    setChats((prev) =>
      prev.map((c) => (c.id === activeChat.id ? updatedActiveChat : c))
    );
    setInputMessage("");

    // Realistic auto-reply from guide after 1 second
    setTimeout(() => {
      const replies = [
        "Got it! Let me know if you need any other recommendations.",
        "Perfect, I've noted that down for your itinerary!",
        "Sounds great! Looking forward to an amazing experience together.",
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      const replyMsg = {
        id: `msg-reply-${Date.now()}`,
        sender: "them",
        text: randomReply,
        time: "Just now",
      };

      setActiveChat((current) => {
        if (!current || current.id !== activeChat.id) return current;
        return {
          ...current,
          lastMessage: replyMsg.text,
          messages: [...current.messages, replyMsg],
        };
      });

      setChats((prev) =>
        prev.map((c) =>
          c.id === activeChat.id
            ? {
                ...c,
                lastMessage: replyMsg.text,
                messages: [...c.messages, replyMsg],
              }
            : c
        )
      );
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Messages</Text>
          <Text style={styles.headerSubtitle}>
            {totalUnread > 0 ? `${totalUnread} new messages` : "All conversations up to date"}
          </Text>
        </View>

        <Pressable
          style={styles.newChatBtn}
          onPress={() => {
            alert("Starting a new inquiry with Tourvaa travel guides.");
          }}
        >
          <Ionicons name="create-outline" size={20} color={COLORS.primary} />
        </Pressable>
      </View>

      {/* Search Bar */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={17} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search guides or messages..."
            placeholderTextColor={COLORS.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={16} color={COLORS.textSecondary} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterSection}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={filters}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => {
            const active = selectedFilter === item;
            return (
              <Pressable
                style={[styles.filterChip, active && styles.filterChipActive]}
                onPress={() => setSelectedFilter(item)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    active && styles.filterChipTextActive,
                  ]}
                >
                  {item}
                  {item === "Unread" && totalUnread > 0 ? ` (${totalUnread})` : ""}
                </Text>
              </Pressable>
            );
          }}
        />
      </View>

      {/* Chat Threads List */}
      {filteredChats.length > 0 ? (
        <FlatList
          data={filteredChats}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.chatList}
          renderItem={({ item }) => (
            <Pressable style={styles.chatRow} onPress={() => openChat(item)}>
              <View style={styles.avatarBox}>
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                {item.online && <View style={styles.onlineDot} />}
              </View>

              <View style={styles.chatInfo}>
                <View style={styles.chatTopRow}>
                  <Text style={styles.chatName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.chatTime}>{item.time}</Text>
                </View>

                <Text style={styles.chatRole}>{item.role}</Text>

                <View style={styles.chatBottomRow}>
                  <Text
                    style={[
                      styles.chatMessage,
                      item.unread > 0 && styles.chatMessageUnread,
                    ]}
                    numberOfLines={1}
                  >
                    {item.lastMessage}
                  </Text>

                  {item.unread > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadText}>{item.unread}</Text>
                    </View>
                  )}
                </View>
              </View>
            </Pressable>
          )}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="chatbubbles-outline" size={40} color={COLORS.muted} />
          <Text style={styles.emptyTitle}>No messages found</Text>
          <Text style={styles.emptySub}>
            Try changing your search query or filter tab.
          </Text>
        </View>
      )}

      {/* Interactive Chat Modal */}
      {activeChat && (
        <Modal
          visible={true}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setActiveChat(null)}
        >
          <SafeAreaView style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Pressable
                style={styles.modalBackBtn}
                onPress={() => setActiveChat(null)}
              >
                <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
              </Pressable>

              <View style={styles.modalHeaderInfo}>
                <View style={styles.modalAvatarBox}>
                  <Image
                    source={{ uri: activeChat.avatar }}
                    style={styles.modalAvatar}
                  />
                  {activeChat.online && <View style={styles.onlineDot} />}
                </View>
                <View>
                  <Text style={styles.modalName}>{activeChat.name}</Text>
                  <Text style={styles.modalStatus}>
                    {activeChat.online ? "Online • " : "Offline • "}
                    {activeChat.role}
                  </Text>
                </View>
              </View>

              <Pressable
                style={styles.modalActionBtn}
                onPress={() => alert(`Calling ${activeChat.name}...`)}
              >
                <Ionicons name="call-outline" size={20} color={COLORS.primary} />
              </Pressable>
            </View>

            {/* Message Bubble List */}
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              style={{ flex: 1 }}
            >
              <FlatList
                data={activeChat.messages}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.messageList}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                  const isMe = item.sender === "me";
                  return (
                    <View
                      style={[
                        styles.messageRow,
                        isMe ? styles.messageRowMe : styles.messageRowThem,
                      ]}
                    >
                      <View
                        style={[
                          styles.messageBubble,
                          isMe ? styles.bubbleMe : styles.bubbleThem,
                        ]}
                      >
                        <Text
                          style={[
                            styles.bubbleText,
                            isMe ? styles.bubbleTextMe : styles.bubbleTextThem,
                          ]}
                        >
                          {item.text}
                        </Text>
                        <Text
                          style={[
                            styles.bubbleTime,
                            isMe ? styles.bubbleTimeMe : styles.bubbleTimeThem,
                          ]}
                        >
                          {item.time}
                        </Text>
                      </View>
                    </View>
                  );
                }}
              />

              {/* Message Input Box */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Type a message..."
                  placeholderTextColor={COLORS.muted}
                  value={inputMessage}
                  onChangeText={setInputMessage}
                  onSubmitEditing={handleSendMessage}
                  returnKeyType="send"
                />
                <Pressable
                  style={[
                    styles.sendBtn,
                    inputMessage.trim().length > 0 && styles.sendBtnActive,
                  ]}
                  onPress={handleSendMessage}
                >
                  <Ionicons
                    name="send"
                    size={16}
                    color={
                      inputMessage.trim().length > 0
                        ? COLORS.white
                        : COLORS.textSecondary
                    }
                  />
                </Pressable>
              </View>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  newChatBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchWrapper: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  filterSection: {
    marginBottom: 12,
  },
  filterList: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.textSecondary,
  },
  filterChipTextActive: {
    color: COLORS.white,
    fontWeight: "600",
  },
  chatList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  chatRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },
  avatarBox: {
    position: "relative",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  onlineDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  chatInfo: {
    flex: 1,
  },
  chatTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chatName: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: 6,
  },
  chatTime: {
    fontSize: 11,
    color: COLORS.muted,
  },
  chatRole: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: "500",
    marginTop: 1,
  },
  chatBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  chatMessage: {
    fontSize: 12,
    color: COLORS.textSecondary,
    flex: 1,
    marginRight: 8,
  },
  chatMessageUnread: {
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
  unreadBadge: {
    backgroundColor: COLORS.primary,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  unreadText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: "700",
  },
  emptyContainer: {
    alignItems: "center",
    paddingHorizontal: 30,
    marginTop: 50,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginTop: 12,
  },
  emptySub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },

  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalBackBtn: {
    padding: 4,
  },
  modalHeaderInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
    marginLeft: 8,
  },
  modalAvatarBox: {
    position: "relative",
  },
  modalAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  modalName: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  modalStatus: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  modalActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  messageList: {
    padding: 16,
    gap: 12,
  },
  messageRow: {
    flexDirection: "row",
  },
  messageRowMe: {
    justifyContent: "flex-end",
  },
  messageRowThem: {
    justifyContent: "flex-start",
  },
  messageBubble: {
    maxWidth: "75%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  bubbleMe: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  bubbleThem: {
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  bubbleText: {
    fontSize: 13,
    lineHeight: 18,
  },
  bubbleTextMe: {
    color: COLORS.white,
  },
  bubbleTextThem: {
    color: COLORS.textPrimary,
  },
  bubbleTime: {
    fontSize: 9,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  bubbleTimeMe: {
    color: "rgba(255,255,255,0.75)",
  },
  bubbleTimeThem: {
    color: COLORS.muted,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 42,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EEEEEE",
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnActive: {
    backgroundColor: COLORS.primary,
  },
});