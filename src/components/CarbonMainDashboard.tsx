import { useState } from "react";
import {
  Header,
  HeaderContainer,
  HeaderName,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SkipToContent,
  Content,
  Grid,
  Column,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Button,
  Tag,
  Modal,
  ComposedModal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ToastNotification,
  Theme,
  Layer
} from "@carbon/react";
import {
  User,
  Logout,
  Edit,
  Menu
} from "@carbon/icons-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AmbitionsTab from "./AmbitionsTab";
import ProjectsTab from "./ProjectsTab";
import YourProjectsTab from "./YourProjectsTab";
import RequestsTab from "./RequestsTab";
import LeadershipTab from "./LeadershipTab";
import EditProfileModal from "./EditProfileModal";
import type { ProfileFormData } from "@/types/database.types";

const CarbonMainDashboard = () => {
  const { user, loading, signOut } = useAuth();
  const { toast } = useToast();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    return (user?.access_role === 'manager' || user?.access_role === 'leader') ? 2 : 0;
  });
  const [selectedAmbition, setSelectedAmbition] = useState<string | null>(null);

  interface UpdatedUserData {
    name?: string;
    interests?: string;
    skills?: string[];
    products?: string[];
  }

  const handleProfileUpdate = async (updatedUser: UpdatedUserData) => {
    if (!user) return;

    try {
      // Update user profile in the users table
      const { error: updateError } = await supabase
        .from('users')
        .update({
          display_name: updatedUser.name,
          interests: updatedUser.interests ? [updatedUser.interests] : null,
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Handle skills updates
      if (updatedUser.skills && updatedUser.skills.length > 0) {
        // First, delete existing user skills
        await supabase.from('user_skills').delete().eq('user_id', user.id);

        // Get or create skills and link them to user
        for (const skillName of updatedUser.skills) {
          // Try to find existing skill
          const { data: existingSkill } = await supabase
            .from('skills')
            .select('id')
            .eq('name', skillName)
            .single();

          let skillId = existingSkill?.id;

          // If skill doesn't exist, create it
          if (!skillId) {
            const { data: newSkill, error: skillError } = await supabase
              .from('skills')
              .insert({ name: skillName })
              .select('id')
              .single();

            if (skillError) throw skillError;
            skillId = newSkill.id;
          }

          // Link skill to user
          await supabase
            .from('user_skills')
            .insert({ user_id: user.id, skill_id: skillId });
        }
      } else {
        // Remove all user skills if none selected
        await supabase.from('user_skills').delete().eq('user_id', user.id);
      }

      // Handle products updates
      if (updatedUser.products && updatedUser.products.length > 0) {
        // First, delete existing user products
        await supabase.from('user_products').delete().eq('user_id', user.id);

        // Get or create products and link them to user
        for (const productName of updatedUser.products) {
          // Try to find existing product
          const { data: existingProduct } = await supabase
            .from('products')
            .select('id')
            .eq('name', productName)
            .single();

          let productId = existingProduct?.id;

          // If product doesn't exist, create it
          if (!productId) {
            const { data: newProduct, error: productError } = await supabase
              .from('products')
              .insert({ name: productName })
              .select('id')
              .single();

            if (productError) throw productError;
            productId = newProduct.id;
          }

          // Link product to user
          await supabase
            .from('user_products')
            .insert({ user_id: user.id, product_id: productId });
        }
      } else {
        // Remove all user products if none selected
        await supabase.from('user_products').delete().eq('user_id', user.id);
      }

      toast({
        title: "Profile Updated",
        description: "Your profile, skills, and product expertise have been updated successfully.",
      });

      setShowEditProfile(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewProjects = (ambitionTitle: string) => {
    setSelectedAmbition(ambitionTitle);
    setActiveTab((user?.access_role === 'manager' || user?.access_role === 'leader') ? 3 : 2);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'manager':
        return 'red';
      case 'leader': 
        return 'purple';
      default:
        return 'blue';
    }
  };

  const tabItems = [
    ...(user?.access_role === 'manager' || user?.access_role === 'leader' 
      ? [{ label: 'Leadership', value: 'leadership' }] 
      : []
    ),
    { label: 'Ambitions', value: 'ambitions' },
    { label: 'Projects', value: 'projects' },
    { label: 'Your Projects', value: 'your-projects' },
    { label: 'Requests', value: 'requests' }
  ];

  return (
    <Theme theme="white">
      <div className="bx--body">
        <HeaderContainer
          render={({ isSideNavExpanded, onClickSideNavExpand }) => (
            <>
              <Header aria-label="IBM Projects Platform">
                <SkipToContent />
                <HeaderName href="/" prefix="">
                  <div className="flex items-center space-x-3">
                    <img 
                      src="https://i.imgur.com/Yhv1umJ.png" 
                      alt="IBM Logo" 
                      className="w-8 h-8 object-contain"
                    />
                    <span>Your Projects at IBM</span>
                  </div>
                </HeaderName>
                <HeaderGlobalBar>
                  <div className="flex items-center space-x-4 mr-4">
                    {user?.access_role && (
                      <Tag type={getRoleColor(user.access_role)} size="sm">
                        {user.access_role.toUpperCase()}
                      </Tag>
                    )}
                    <span className="text-sm text-gray-600">{user?.email}</span>
                  </div>
                  <HeaderGlobalAction
                    aria-label="Edit Profile"
                    tooltipAlignment="end"
                    onClick={() => setShowEditProfile(true)}
                  >
                    <Edit size={20} />
                  </HeaderGlobalAction>
                  <HeaderGlobalAction
                    aria-label="Logout"
                    tooltipAlignment="end"
                    onClick={handleSignOut}
                  >
                    <Logout size={20} />
                  </HeaderGlobalAction>
                </HeaderGlobalBar>
              </Header>
              
              <Content>
                <Layer level={0}>
                  <Grid className="page-content" fullWidth>
                    <Column lg={16} md={8} sm={4}>
                      <div className="page-content__main">
                        <Tabs 
                          selectedIndex={activeTab}
                          onChange={({ selectedIndex }) => setActiveTab(selectedIndex)}
                        >
                          <TabList 
                            aria-label="Main navigation tabs"
                            className="mb-8"
                          >
                            {tabItems.map((tab, index) => (
                              <Tab key={tab.value}>{tab.label}</Tab>
                            ))}
                          </TabList>
                          
                          <TabPanels>
                            {(user?.access_role === 'manager' || user?.access_role === 'leader') && (
                              <TabPanel>
                                <LeadershipTab user={user} />
                              </TabPanel>
                            )}
                            
                            <TabPanel>
                              <AmbitionsTab 
                                user={user} 
                                selectedAmbition={selectedAmbition} 
                                onClearFilter={() => setSelectedAmbition(null)} 
                              />
                            </TabPanel>
                            
                            <TabPanel>
                              <YourProjectsTab user={user} authLoading={loading} />
                            </TabPanel>
                            
                            <TabPanel>
                              <RequestsTab user={user} />
                            </TabPanel>
                          </TabPanels>
                        </Tabs>
                      </div>
                    </Column>
                  </Grid>
                </Layer>
              </Content>
            </>
          )}
        />

        <EditProfileModal
          open={showEditProfile}
          onOpenChange={setShowEditProfile}
          user={user}
          onUpdate={handleProfileUpdate}
        />
      </div>
    </Theme>
  );
};

export default CarbonMainDashboard;