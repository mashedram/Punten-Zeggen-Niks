import { CreateButton } from '@/components/Home_page/CreateButton';
import { JoinButton } from '@/components/Home_page/JoinButton';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomePage() {
  return (
    <div>
      <CreateButton />
      <JoinButton />
    </div>
  );
}
