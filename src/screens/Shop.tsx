import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Dimensions,
  Alert,
  Animated,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../contexts/AppContext';
import { buddyAssets, BuddyKey, SexKey } from '../assets/buddies';
import { BUDDIES_DATA } from '../data/buddiesData';
import BuddyModal from '../components/BuddyModal';

const { width } = Dimensions.get('window');

interface ShopProps {
  onBack: () => void;
  isScenesSelected: boolean;
  setIsScenesSelected: (isScenes: boolean) => void;
}

const Shop: React.FC<ShopProps> = ({ onBack, isScenesSelected, setIsScenesSelected }) => {
  const {
    userCoins,
    selectedCharacter,
    selectedBackground,
    ownedCharacters,
    ownedBackgrounds,
    ownedAccessories,
    setSelectedCharacter,
    setSelectedBackground,
    purchaseItem,
    setShowCoinPurchase,
    selectedBuddyId,
    gender,
  } = useApp();
  const sexKey: SexKey = gender === "lady" ? "w" : "m";
  
  const [selectedBuddy, setSelectedBuddy] = useState<any>(null);
  const [showBuddyModal, setShowBuddyModal] = useState(false);





  // Buddies data with multi-language support
  const buddies = [
    {
      id: "zebra-boy",
      emoji: "🦓",
      name: "Зебра",
      gender: "👦",
      genderType: "Хлопчик",
      ukName: "ЗеброБро",
      enName: "ZebraBro",
      esName: "CebraCompas",
      ukDescription: "«Біжи зі мною, і ми залишимо дим позаду швидше, ніж він встигне нас наздогнати.»",
      enDescription: "Run with me, and we'll leave smoke behind faster than it can catch us.",
      esDescription: "Corre conmigo y dejaremos el humo atrás antes de que pueda alcanzarnos.",
      price: 150,
      owned: false,
      type: 'character'
    },
    {
      id: "bulldog-boy",
      emoji: "🐶",
      name: "Бульдог",
      gender: "👦",
      genderType: "Хлопчик",
      ukName: "БульбаДог",
      enName: "SpudDog",
      esName: "PerroPapa",
      ukDescription: "«Тримайся поруч — ми здолаємо дим швидше, ніж він думає.»",
      enDescription: "Stick with me — we'll beat smoke faster than it thinks.",
      esDescription: "Quédate cerca: venceremos al humo más rápido de lo que cree.",
      price: 200,
      owned: false,
      type: 'character'
    },
    {
      id: "fox-boy",
      emoji: "🦊",
      name: "Лис",
      gender: "👦",
      genderType: "Хлопчик",
      ukName: "Рижобосс",
      enName: "GingerBoss",
      esName: "JefeZorro",
      ukDescription: "«З двома розумними головами дим не матиме жодного шансу — ми кинемо вдвічі швидше.»",
      enDescription: "With two clever heads, smoke stands no chance — we'll quit twice as fast.",
      esDescription: "Con dos cabezas listas, el humo no tendrá ninguna oportunidad: dejaremos el vicio el doble de rápido.",
      price: 250,
      owned: false,
      type: 'character'
    },
    {
      id: "llama-boy",
      emoji: "🦙",
      name: "Лама",
      gender: "👦",
      genderType: "Хлопчик",
      ukName: "Ламбургер",
      enName: "Lamburger",
      esName: "Lamburguesa",
      ukDescription: "«Піднімайся зі мною — і ми швидше, ніж думаємо, дістанемося вершини без диму.»",
      enDescription: "Climb with me — and we'll reach the smoke-free top faster than we think.",
      esDescription: "Sube conmigo: alcanzaremos la cima sin humo más rápido de lo que creemos.",
      price: 175,
      owned: false,
      type: 'character'
    },
    {
      id: "koala-boy",
      emoji: "🐨",
      name: "Коала",
      gender: "👦",
      genderType: "Хлопчик",
      ukName: "ДонСон",
      enName: "Don Snooze",
      esName: "Don Siesta",
      ukDescription: "«Обійми життя зі мною — і ми струснемо дим швидше, ніж він вчепиться.»",
      enDescription: "Embrace life with me — and we'll shake off smoke faster than it can cling.",
      esDescription: "Abraza la vida conmigo y sacudiremos el humo antes de que se aferre.",
      price: 125,
      owned: false,
      type: 'character'
    },
    {
      id: "bulldog-girl",
      emoji: "🐶",
      name: "Бульдог",
      gender: "👧",
      genderType: "Дівчинка",
      ukName: "БульбаКвін",
      enName: "SpudQueen",
      esName: "ReinaPapa",
      ukDescription: "«Разом ми сяємо яскравіше, і кидати дим стане легше й швидше.»",
      enDescription: "Together we shine brighter, and quitting smoke gets easier and faster.",
      esDescription: "Juntas brillamos más, y dejar el humo será más fácil y rápido.",
      price: 200,
      owned: false,
      type: 'character'
    },
    {
      id: "llama-girl",
      emoji: "🦙",
      name: "Лама",
      gender: "👧",
      genderType: "Дівчинка",
      ukName: "Ламурка",
      enName: "Lamazing",
      esName: "Lamuriosa",
      ukDescription: "«Пліч-о-пліч ми вдихнемо свіже повітря і виженемо дим за мить.»",
      enDescription: "Side by side we'll breathe fresh air and chase smoke away in no time.",
      esDescription: "Hombro a hombro respiraremos aire fresco y echaremos el humo en un instante.",
      price: 175,
      owned: false,
      type: 'character'
    },
    {
      id: "fox-girl",
      emoji: "🦊",
      name: "Лисиця",
      gender: "👧",
      genderType: "Дівчинка",
      ukName: "ФоксіБоссі",
      enName: "FoxyBossy",
      esName: "JefaZorra",
      ukDescription: "«Перехитрімо дим разом — удвох ми швидко закінчимо цю гру.»",
      enDescription: "Let's outsmart smoke together — the two of us will finish this game fast.",
      esDescription: "Engañemos al humo juntas: las dos acabaremos este juego rápido.",
      price: 250,
      owned: false,
      type: 'character'
    },
    {
      id: "koala-girl",
      emoji: "🐨",
      name: "Коала",
      gender: "👧",
      genderType: "Дівчинка",
      ukName: "СоняЛав",
      enName: "NapCutie",
      esName: "SiestaAmor",
      ukDescription: "«Разом ми знайдемо спокій — і покинемо дим набагато швидше.»",
      enDescription: "Together we'll find peace — and leave smoke far behind much faster.",
      esDescription: "Juntas encontraremos la calma y dejaremos el humo mucho más rápido.",
      price: 125,
      owned: false,
      type: 'character'
    },
    {
      id: "zebra-girl",
      emoji: "🦓",
      name: "Зебра",
      gender: "👧",
      genderType: "Дівчинка",
      ukName: "ЧорноБілка",
      enName: "Zebrabelle",
      esName: "Zebrita",
      ukDescription: "«Якщо ми мріятимемо пліч-о-пліч, дим зникне вдвічі швидше.»",
      enDescription: "If we dream side by side, smoke will disappear twice as fast.",
      esDescription: "Si soñamos lado a lado, el humo desaparecerá el doble de rápido.",
      price: 150,
      owned: false,
      type: 'character'
    }
  ];

  // Scenes data - backgrounds only
  const scenes = [
    { id: "default", emoji: "🌅", name: "Default", price: 0, owned: true },
    { id: "1", emoji: "🌅", name: "Sunset", price: 50, owned: false },
    { id: "2", emoji: "🌊", name: "Ocean", price: 100, owned: false },
    { id: "3", emoji: "🌲", name: "Forest", price: 150, owned: false },
    { id: "4", emoji: "💜", name: "Purple", price: 200, owned: false },
    { id: "5", emoji: "🌑", name: "Dark", price: 250, owned: false },
    { id: "6", emoji: "🌸", name: "Cherry Blossom", price: 175, owned: false },
    { id: "7", emoji: "🏔️", name: "Mountain", price: 225, owned: false },
    { id: "8", emoji: "🌆", name: "City", price: 125, owned: false },
  ];



  const renderBuddiesGrid = () => (
    <View className="w-full -mx-1 -my-1 flex-row flex-wrap">
      {BUDDIES_DATA.map((item) => {
        const isOwned = ownedCharacters.includes(item.id);
        const isSelected = selectedCharacter.id === item.id;
        
        return (
          <Pressable
            key={item.id}
            className={`w-1/4 px-1 py-1`}
            onPress={() => {
              setSelectedBuddy(item);
              setShowBuddyModal(true);
            }}
          >
            <View className={`items-center bg-white/10 rounded-xl p-2 relative ${
              isSelected ? 'bg-white/20 border-2 border-white' : ''
            } ${isOwned && !isSelected ? 'bg-white/15' : ''}`}>
              <View className="w-[80px] h-[80px] overflow-hidden">
                <Image source={item.icon} className='w-[80px] h-[110px]' resizeMode="contain" />
              </View>
            </View>
      
            
          </Pressable>
        );
      })}
    </View>
  );

  const renderScenesGrid = () => (
    <View className="flex-row flex-wrap gap-2">
      {scenes.map((item) => {
        const isOwned = ownedBackgrounds.includes(item.id);
        const isSelected = selectedBackground.id === item.id;

        return (
          <Pressable
            key={item.id}
            className={`w-[${(width - 80) / 4}px] bg-white/10 rounded-xl p-3 items-center relative ${
              isSelected ? 'bg-white/20 border-2 border-white' : ''
            } ${isOwned && !isSelected ? 'bg-white/15' : ''}`}
            // onPress={() => handleSelect(item, 'backgrounds')}
          >
            <Text className="text-2xl mb-1.5">{item.emoji}</Text>
            <Text className="text-xs font-bold text-white mb-0.5 text-center">{item.name}</Text>
            <Text className="text-[10px] text-white/70 text-center">
              {isOwned ? (isSelected ? 'Selected' : 'Owned') : item.price === 0 ? 'Free' : `${item.price} coins`}
            </Text>
            {isSelected && (
              <View className="absolute top-2 right-2">
                <Ionicons name="checkmark-circle" size={16} color="#000000" />
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );

  return (
    <View className="flex-1 bg-[#1F1943]">

      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 20 }}
      >

        {/* Items */}
        <View className="flex-1">
          {!isScenesSelected ? renderBuddiesGrid() : renderScenesGrid()}
        </View>
      </ScrollView>

      <BuddyModal
        visible={showBuddyModal}
        buddy={selectedBuddy}
        onClose={() => {
          setShowBuddyModal(false);
          setSelectedBuddy(null);
        }}
      />
    </View>
  );
};

export default Shop; 