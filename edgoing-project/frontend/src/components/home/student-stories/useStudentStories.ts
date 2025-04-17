
import { useState, useEffect } from 'react';
import { StudentStory, getStudentStories, addStudentStory, updateStudentStory, removeStudentStory, updateStoriesOrder } from '@/services/student-stories/studentStoriesService';

export const useStudentStories = () => {
  const [stories, setStories] = useState<StudentStory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newStory, setNewStory] = useState<Omit<StudentStory, 'id'>>({
    image: '/placeholder.svg',
    name_en: '',
    name_zh: '',
    background_en: '',
    background_zh: '',
    testimonial_en: '',
    testimonial_zh: '',
    rating: 5,
    order_index: 0
  });

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    setIsLoading(true);
    const data = await getStudentStories();
    setStories(data);
    setIsLoading(false);
  };

  const addStory = async () => {
    const story = await addStudentStory({
      ...newStory,
      order_index: stories.length + 1
    });
    if (story) {
      setStories([...stories, story]);
      setNewStory({
        image: '/placeholder.svg',
        name_en: '',
        name_zh: '',
        background_en: '',
        background_zh: '',
        testimonial_en: '',
        testimonial_zh: '',
        rating: 5,
        order_index: 0
      });
    }
  };

  const removeStory = async (id: string) => {
    const success = await removeStudentStory(id);
    if (success) {
      setStories(stories.filter(story => story.id !== id));
    }
  };

  const moveStory = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = stories.findIndex(story => story.id === id);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === stories.length - 1)
    ) {
      return;
    }

    const newStories = [...stories];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    [newStories[currentIndex], newStories[targetIndex]] = [
      newStories[targetIndex],
      newStories[currentIndex]
    ];

    // Update order_index for all stories
    const updatedStories = newStories.map((story, index) => ({
      ...story,
      order_index: index + 1
    }));

    const success = await updateStoriesOrder(updatedStories);
    if (success) {
      setStories(updatedStories);
    }
  };

  return {
    stories,
    newStory,
    setNewStory,
    addStory,
    removeStory,
    moveStory,
    isLoading
  };
};
