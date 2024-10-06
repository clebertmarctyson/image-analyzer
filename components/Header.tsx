import { CardHeader, CardTitle } from "@/components/ui/card";

const Header = () => {
  return (
    <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
      <CardTitle className="text-2xl font-bold text-center">
        Image Analyzer
      </CardTitle>
    </CardHeader>
  );
};

export default Header;
