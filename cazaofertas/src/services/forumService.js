// Forum Service - Simulated data service to replace Supabase calls
import mockData, { generateUUID } from '../data/mockData.js';

// Simulated delay to mimic API calls
const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Get user profile info (simulated)
const getUserProfile = (userId) => {
  const user = mockData.users.find(u => u.id === userId);
  if (!user) return null;
  
  return {
    id: user.id,
    nombre_usuario: user.name,
    avatar_url: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0ea5e9&color=fff&size=128`
  };
};

export const forumService = {
  // Get forum categories
  async getCategories() {
    await simulateDelay(300);
    return {
      data: mockData.forumCategories.map(category => ({
        id: category.id,
        nombre: category.name,
        descripcion: category.description,
        icono: category.icon,
        hilos_count: mockData.forumThreads.filter(t => t.categoria_id === category.id).length,
        mensajes_count: mockData.forumThreads
          .filter(t => t.categoria_id === category.id)
          .reduce((acc, thread) => acc + mockData.forumPosts.filter(p => p.tema_id === thread.id).length, 0),
        created_at: category.createdAt,
        updated_at: category.updatedAt
      })),
      error: null
    };
  },
  // Get forum threads with author and category info
  async getThreads() {
    await simulateDelay(400);
    
    const threadsWithDetails = mockData.forumThreads.map(thread => {
      const author = getUserProfile(thread.user_id);
      const category = mockData.forumCategories.find(c => c.id === thread.categoria_id);
      const repliesCount = mockData.forumPosts.filter(p => p.tema_id === thread.id).length;
      
      // Calculate vote total for thread
      const threadVotes = mockData.forumVotes
        .filter(v => v.item_id === thread.id && v.item_type === 'thread')
        .reduce((sum, vote) => sum + vote.vote_value, 0);
      
      return {
        ...thread,
        profiles: author,
        foro_categorias: category ? { nombre: category.name } : null,
        replies_count: repliesCount,
        votos_total: threadVotes
      };
    });

    return {
      data: threadsWithDetails.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
      error: null
    };
  },
  // Get single thread with details
  async getThread(threadId) {
    await simulateDelay(300);
    
    const thread = mockData.forumThreads.find(t => t.id === threadId);
    if (!thread) {
      return { data: null, error: { message: 'Thread not found' } };
    }

    const author = getUserProfile(thread.user_id);
    const category = mockData.forumCategories.find(c => c.id === thread.categoria_id);
    
    // Calculate vote total for thread
    const threadVotes = mockData.forumVotes
      .filter(v => v.item_id === thread.id && v.item_type === 'thread')
      .reduce((sum, vote) => sum + vote.vote_value, 0);
    
    // Simulate view count increment
    thread.vistas = (thread.vistas || 0) + 1;
    
    return {
      data: {
        ...thread,
        profiles: author,
        foro_categorias: category ? { nombre: category.name } : null,
        votos_total: threadVotes
      },
      error: null
    };
  },
  // Get messages for a thread
  async getThreadMessages(threadId) {
    await simulateDelay(250);
    
    const messages = mockData.forumPosts
      .filter(post => post.tema_id === threadId)
      .map(post => {
        // Calculate vote total for message
        const messageVotes = mockData.forumVotes
          .filter(v => v.item_id === post.id && v.item_type === 'message')
          .reduce((sum, vote) => sum + vote.vote_value, 0);
        
        return {
          ...post,
          profiles: getUserProfile(post.user_id),
          votos_total: messageVotes
        };
      })
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    return {
      data: messages,
      error: null
    };
  },

  // Get replies count for a thread
  async getThreadRepliesCount(threadId) {
    await simulateDelay(100);
    
    const count = mockData.forumPosts.filter(p => p.tema_id === threadId).length;
    
    return {
      count,
      error: null
    };
  },

  // Create new thread
  async createThread(threadData) {
    await simulateDelay(400);
    
    const newThread = {
      id: generateUUID(),
      titulo: threadData.titulo,
      contenido: threadData.contenido,
      categoria_id: threadData.categoria_id,
      user_id: threadData.user_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      vistas: 0,
      fijado: false,
      cerrado: false
    };

    // Add to mock data
    mockData.forumThreads.unshift(newThread);
    
    return {
      data: [newThread],
      error: null
    };
  },

  // Create new message/reply
  async createMessage(messageData) {
    await simulateDelay(300);
    
    const newMessage = {
      id: generateUUID(),
      tema_id: messageData.tema_id,
      user_id: messageData.user_id,
      contenido: messageData.contenido,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Add to mock data
    mockData.forumPosts.push(newMessage);
    
    // Update thread's updated_at
    const thread = mockData.forumThreads.find(t => t.id === messageData.tema_id);
    if (thread) {
      thread.updated_at = new Date().toISOString();
    }
    
    return {
      error: null
    };
  },

  // Delete thread
  async deleteThread(threadId, userId) {
    await simulateDelay(400);
    
    const threadIndex = mockData.forumThreads.findIndex(t => t.id === threadId && t.user_id === userId);
    if (threadIndex === -1) {
      return { error: { message: 'Thread not found or unauthorized' } };
    }

    // Remove thread and its messages
    mockData.forumThreads.splice(threadIndex, 1);
    mockData.forumPosts = mockData.forumPosts.filter(p => p.tema_id !== threadId);
    
    return { error: null };
  },

  // Delete message
  async deleteMessage(messageId, userId) {
    await simulateDelay(300);
    
    const messageIndex = mockData.forumPosts.findIndex(p => p.id === messageId && p.user_id === userId);
    if (messageIndex === -1) {
      return { error: { message: 'Message not found or unauthorized' } };
    }

    mockData.forumPosts.splice(messageIndex, 1);
    
    return { error: null };
  },
  // Update thread view count
  async updateThreadViews(threadId) {
    await simulateDelay(100);
    
    const thread = mockData.forumThreads.find(t => t.id === threadId);
    if (thread) {
      thread.vistas = (thread.vistas || 0) + 1;
    }
    
    return { error: null };
  },

  // Vote on thread
  async voteThread(threadId, userId, voteValue) {
    await simulateDelay(200);
    
    // Find existing vote
    const existingVoteIndex = mockData.forumVotes.findIndex(
      v => v.item_id === threadId && v.user_id === userId && v.item_type === 'thread'
    );
    
    let oldVote = 0;
    if (existingVoteIndex !== -1) {
      oldVote = mockData.forumVotes[existingVoteIndex].vote_value;
      if (voteValue === null) {
        // Remove vote
        mockData.forumVotes.splice(existingVoteIndex, 1);
      } else {
        // Update vote
        mockData.forumVotes[existingVoteIndex].vote_value = voteValue;
        mockData.forumVotes[existingVoteIndex].updated_at = new Date().toISOString();
      }
    } else if (voteValue !== null) {
      // Create new vote
      mockData.forumVotes.push({
        id: generateUUID(),
        item_id: threadId,
        user_id: userId,
        item_type: 'thread',
        vote_value: voteValue,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
    
    return { error: null, oldVote, newVote: voteValue };
  },

  // Vote on message
  async voteMessage(messageId, userId, voteValue) {
    await simulateDelay(200);
    
    // Find existing vote
    const existingVoteIndex = mockData.forumVotes.findIndex(
      v => v.item_id === messageId && v.user_id === userId && v.item_type === 'message'
    );
    
    let oldVote = 0;
    if (existingVoteIndex !== -1) {
      oldVote = mockData.forumVotes[existingVoteIndex].vote_value;
      if (voteValue === null) {
        // Remove vote
        mockData.forumVotes.splice(existingVoteIndex, 1);
      } else {
        // Update vote
        mockData.forumVotes[existingVoteIndex].vote_value = voteValue;
        mockData.forumVotes[existingVoteIndex].updated_at = new Date().toISOString();
      }
    } else if (voteValue !== null) {
      // Create new vote
      mockData.forumVotes.push({
        id: generateUUID(),
        item_id: messageId,
        user_id: userId,
        item_type: 'message',
        vote_value: voteValue,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
    
    return { error: null, oldVote, newVote: voteValue };
  },

  // Get user's vote for an item
  async getUserVote(itemId, userId, itemType) {
    await simulateDelay(100);
    
    const vote = mockData.forumVotes.find(
      v => v.item_id === itemId && v.user_id === userId && v.item_type === itemType
    );
    
    return {
      data: vote ? vote.vote_value : null,
      error: null
    };
  },

  // Get vote count for an item
  async getVoteCount(itemId, itemType) {
    await simulateDelay(100);
    
    const votes = mockData.forumVotes.filter(
      v => v.item_id === itemId && v.item_type === itemType
    );
    
    const totalVotes = votes.reduce((sum, vote) => sum + vote.vote_value, 0);
    
    return {
      data: totalVotes,
      error: null
    };
  }
};

export default forumService;
