import { Link } from "react-router-dom";

export const Legal = () => {
  return (
    <div className="container h-full mx-auto" data-testid="legal">
      <div className="flex flex-col my-12 px-6 space-y-6">
        <h2 className="text-bold">Terms of Service</h2>
        <p className="text-xl text-justify">
          Welcome to The Monkeys! We are excited to provide you with a platform
          for reading and writing blogs and posts on a variety of topics. By
          using our service, you agree to be bound by the following terms of
          service:
        </p>
        <ul className="text-xl list-disc ml-6 space-y-4 text-justify">
          <li>
            User Content: Our service allows users to post, upload, and share
            content, including but not limited to text, images, and videos
            ("User Content"). You are solely responsible for the User Content
            you make available through our service.
          </li>
          <li>
            Prohibited Content: You agree not to post, upload, or share any User
            Content that is illegal, infringing, defamatory, or otherwise
            offensive or inappropriate. This includes, but is not limited to,
            content that is racist, sexist, discriminatory, or promotes
            violence.
          </li>
          <li>
            Copyright and Intellectual Property: By making any User Content
            available through our service, you represent and warrant that you
            have all necessary rights and licenses to do so. You also agree to
            indemnify us for any claims brought against us as a result of your
            User Content.
          </li>
          <li>
            Account Suspension and Termination: We reserve the right to remove
            or edit any User Content that violates these terms of service, or
            for any other reason at our discretion. We also reserve the right to
            suspend or terminate your account for any violation of these terms
            of service.
          </li>
          <li>
            Privacy: We take the privacy of our users very seriously. Our
            privacy policy, which is incorporated into these terms of service by
            reference, explains how we collect, use, and disclose information
            about our users.
          </li>
          <li>
            Third-Party Websites and Services: Our service may contain links to
            third-party websites and services. We are not responsible for the
            content, privacy policies, or practices of those websites and
            services.
          </li>
          <li>
            Disclaimers: Our service is provided on an "as is" and "as
            available" basis. We make no representations or warranties of any
            kind, express or implied, about the completeness, accuracy,
            reliability, suitability or availability with respect to the service
            or the information, products, services, or related graphics
            contained on the service for any purpose.
          </li>
          <li>
            Limitation of Liability: To the fullest extent permitted by law, we
            will not be liable for any damages of any kind arising from the use
            of our service, including but not limited to direct, indirect,
            incidental, punitive, and consequential damages.
          </li>
          <li>
            Changes to the Terms of Service: We reserve the right to make
            changes to these terms of service at any time. Your continued use of
            our service after any changes have been made will constitute
            acceptance of those changes.
          </li>
        </ul>
        <p className="text-xl text-justify">
          We hope you enjoy using our service! If you have any questions or
          concerns, please feel free to
          <Link to="">contact us</Link> at any time.
        </p>
      </div>
    </div>
  );
};
